(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  function getData() { return window.AppStorage.read().data || {}; }
  function saveSection(section, fields, feedbackSelector, successText) {
    const data = getData();
    data[section] = Object.fromEntries(fields.map(id => [id, $("#"+id).value.trim()]));
    const saved = window.AppStorage.write(data);
    $(feedbackSelector).textContent = saved.ok ? successText : saved.error;
    $("#save-status").textContent = saved.ok ? "Guardado en este navegador" : "Guardado no disponible";
    return saved.ok;
  }
  $("#company-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!$("#company").value.trim() || !$("#offer").value.trim()) {
      $("#company-feedback").textContent = "Añade al menos el nombre de la empresa y lo que ofrece.";
      return;
    }
    const ok = saveSection("company", ["company","sector","offer","difference"], "#company-feedback", "Perfil guardado. Valida cualquier diferencia que todavía no puedas respaldar.");
    if (ok) {
      const data = getData(); data.profileSaved = true; window.AppStorage.write(data);
      if (window.AppLearning) window.AppLearning.updateProgress();
    }
  });
  $("#strategy-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!$("#goal").value || !$("#audience").value.trim()) {
      $("#strategy-feedback").textContent = "Selecciona un objetivo y describe brevemente la audiencia.";
      return;
    }
    const ok = saveSection("strategy", ["goal","horizon","audience"], "#strategy-feedback", "Borrador guardado. Revisa si el objetivo y la audiencia están respaldados por información real.");
    if (ok) {
      const data = getData(); data.strategySaved = true; window.AppStorage.write(data);
      if (window.AppLearning) window.AppLearning.updateProgress();
    }
  });
  function restore() {
    const data = getData();
    [["company",["company","sector","offer","difference"]],["strategy",["goal","horizon","audience"]]].forEach(([key, ids]) => {
      if (!data[key]) return;
      ids.forEach(id => { const el=$("#"+id); if(el && data[key][id] !== undefined) el.value=data[key][id]; });
    });
  }
  window.AppForms = { restore };
})();