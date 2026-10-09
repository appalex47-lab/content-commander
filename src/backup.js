(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  let selectedBackup = null;
  let selectedFileName = "";
  function feedback(message, isError=false) {
    const el = $("#backup-feedback"); el.textContent = message;
    el.dataset.state = isError ? "error" : "success";
  }
  function renderPreview(preview) {
    const container = $("#backup-preview");
    container.replaceChildren();
    const heading = document.createElement("h4"); heading.textContent = "Vista previa del respaldo";
    const summary = document.createElement("p"); summary.textContent = `Archivo: ${selectedFileName}. Exportado: ${preview.exportedAt}. Secciones: ${preview.sectionCount}.`;
    const list = document.createElement("ul");
    if (preview.sections.length) preview.sections.forEach(section => { const li=document.createElement("li"); li.textContent=section; list.appendChild(li); });
    else { const li=document.createElement("li"); li.textContent="El respaldo no contiene secciones de datos."; list.appendChild(li); }
    container.append(heading, summary, list);
  }
  $("#export-backup").addEventListener("click", async () => {
    try {
      const content = await window.AppStorage.createBackup();
      const blob = new Blob([content], {type:"application/json;charset=utf-8"});
      const url = URL.createObjectURL(blob); const a=document.createElement("a");
      a.href=url; a.download=`content-commander-respaldo-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      feedback("Respaldo exportado. Guárdalo en un lugar seguro.");
    } catch (error) { feedback(error.message || "No se pudo exportar el respaldo.", true); }
  });
  $("#backup-file").addEventListener("change", () => {
    selectedBackup=null; $("#import-backup").disabled=true; $("#backup-preview").replaceChildren();
    const file=$("#backup-file").files[0]; selectedFileName=file ? file.name : "";
    feedback(file ? "Archivo seleccionado. Pulsa «Validar y ver vista previa»." : "Selecciona un archivo JSON.", !file);
  });
  $("#validate-backup").addEventListener("click", async () => {
    const file=$("#backup-file").files[0];
    if (!file) { feedback("Selecciona primero un archivo JSON.", true); return; }
    if (file.size > 10 * 1024 * 1024) { feedback("El archivo supera el límite de 10 MB.", true); return; }
    try {
      const text=await file.text(); const checked=window.AppStorage.validateBackup(text);
      if (!checked.ok) { selectedBackup=null; $("#import-backup").disabled=true; feedback(checked.error, true); return; }
      selectedBackup=checked.data; renderPreview(checked.preview); $("#import-backup").disabled=false;
      feedback("Respaldo válido. Revisa las secciones y confirma la importación.");
    } catch (_) { selectedBackup=null; $("#import-backup").disabled=true; feedback("No se pudo leer el archivo.", true); }
  });
  $("#import-backup").addEventListener("click", async () => {
    if (!selectedBackup) { feedback("Valida un respaldo antes de importarlo.", true); return; }
    const mode=$("#import-mode").value;
    const confirmText=mode === "replace" ? "Esto reemplazará los datos actuales de la aplicación. ¿Continuar?" : "Se combinarán las secciones; las del archivo sustituirán a las actuales. ¿Continuar?";
    if (!window.confirm(confirmText)) return;
    const result=await window.AppStorage.importBackup({app:"Content Commander",backupVersion:1,data:selectedBackup},mode);
    if (!result.ok) { feedback(result.error || "No se pudo importar el respaldo.", true); return; }
    feedback(`Importación completada (${mode === "replace" ? "reemplazo" : "combinación"}). Recargando los datos de la pantalla…`);
    $("#import-backup").disabled=true; selectedBackup=null;
    if (window.AppForms) await window.AppForms.restore();
    if (window.AppLearning) await window.AppLearning.restore();
    $("#save-status").textContent="Respaldo importado";
  });
})();
