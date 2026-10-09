(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  async function getData() { const result = await window.AppStorage.read(); return result.data || {}; }
  async function saveSection(section, fields, feedbackSelector, successText) {
    const data = await getData();
    data[section] = Object.fromEntries(fields.map(id => [id, $("#"+id).value.trim()]));
    data[section + "Saved"] = true;
    data[section + "UpdatedAt"] = new Date().toISOString();
    const saved = await window.AppStorage.write(data);
    $(feedbackSelector).textContent = saved.ok ? successText : saved.error;
    $("#save-status").textContent = saved.ok ? "Guardado en este navegador" : "Guardado no disponible";
    if (saved.ok && window.AppLearning) await window.AppLearning.updateProgress();
    return saved.ok;
  }
  $("#company-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!$("#company").value.trim() || !$("#offer").value.trim()) { $("#company-feedback").textContent = "Añade al menos el nombre de la empresa y lo que ofrece."; return; }
    const fields = ["company","sector","offer","mission","vision","values","valueProposition","difference","audience","tone","personality","evidence","restrictions","notes"];
    const saved = await saveSection("company", fields, "#company-feedback", "Perfil maestro guardado. Revisa la lista de campos pendientes y valida las afirmaciones antes de usarlas.");
    if (saved) updateCompanyCompleteness();
  });
  $("#strategy-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!$("#goal").value || !$("#audience").value.trim()) { $("#strategy-feedback").textContent = "Selecciona un objetivo y describe brevemente la audiencia."; return; }
    await saveSection("strategy", ["goal","horizon","audience"], "#strategy-feedback", "Borrador guardado. Revisa si el objetivo y la audiencia están respaldados por información real.");
  });
  async function restore() {
    const data = await getData();
    [["company",["company","sector","offer","mission","vision","values","valueProposition","difference","audience","tone","personality","evidence","restrictions","notes"]],["strategy",["goal","horizon","audience"]]].forEach(([key, ids]) => {
      if (!data[key]) return;
      ids.forEach(id => { const el=$("#"+id); if(el && data[key][id] !== undefined) el.value=data[key][id]; });
    });
    updateCompanyCompleteness();
  }
  function updateCompanyCompleteness() {
    const root = $("#company-completeness");
    if (!root) return;
    const ids = ["company","sector","offer","mission","vision","values","valueProposition","difference","audience","tone","personality","evidence","restrictions"];
    const completed = ids.filter(id => { const el=$("#"+id); return el && el.value.trim(); }).length;
    const required = ["company","offer"];
    const requiredOk = required.every(id => $("#"+id)?.value.trim());
    const heading = root.querySelector("b");
    const paragraph = root.querySelector("p");
    if (heading) heading.textContent = `${completed} de ${ids.length} campos clave completados`;
    if (paragraph) paragraph.textContent = requiredOk ? "La base mínima está cubierta. Los campos restantes pueden seguir pendientes; confirma siempre la evidencia de tus afirmaciones." : "Para completar la base mínima, añade el nombre de la empresa y qué ofrece. Los demás campos pueden quedar pendientes.";
    root.dataset.complete = requiredOk ? "true" : "false";
  }
  ["company","sector","offer","mission","vision","values","valueProposition","difference","audience","tone","personality","evidence","restrictions","notes"].forEach(id => { const el=$("#"+id); if(el) el.addEventListener("input", updateCompanyCompleteness); });
  window.AppForms = { restore, updateCompanyCompleteness };
})();
