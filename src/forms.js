(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  async function getData() { const result = await window.AppStorage.read(); return result.data || {}; }
  async function saveSection(section, fields, feedbackSelector, successText) {
    const data = await getData();
    data[section] = { ...(data[section] || {}), ...Object.fromEntries(fields.map(id => [id === "companyAudience" ? "audience" : id, $("#"+id).value.trim()])) };
    data[section + "Saved"] = true; data[section + "UpdatedAt"] = new Date().toISOString();
    const saved = await window.AppStorage.write(data);
    $(feedbackSelector).textContent = saved.ok ? successText : saved.error;
    $("#save-status").textContent = saved.ok ? "Guardado en este navegador" : "Guardado no disponible";
    if (saved.ok && window.AppLearning) await window.AppLearning.updateProgress();
    return saved.ok;
  }
  $("#company-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!( $("#company").value.trim()) || !$("#offer").value.trim()) { $("#company-feedback").textContent = "Añade al menos el nombre de la empresa y lo que ofrece."; return; }
    const fields = ["company","sector","offer","mission","vision","values","valueProposition","difference","companyAudience","tone","personality","evidence","restrictions","notes"];
    const saved = await saveSection("company", fields, "#company-feedback", "Perfil maestro guardado. Revisa los campos pendientes y valida las afirmaciones antes de usarlas.");
    if (saved) updateCompanyCompleteness();
  });

  const PILLAR_FIELDS = ["name", "description", "percentage"];
  function addPillar(pillar = {}) {
    const root = $("#pillars-list"); if (!root) return;
    const row = document.createElement("div"); row.className = "pillar-row";
    const makeLabel = (text, key, placeholder, type="text") => {
      const label = document.createElement("label"); label.append(document.createTextNode(text));
      const input = document.createElement("input"); input.type = type; input.dataset.pillarField = key; input.placeholder = placeholder;
      if (type === "number") { input.min = "0"; input.max = "100"; input.step = "1"; input.inputMode = "numeric"; }
      input.value = pillar[key] ?? (key === "percentage" ? "0" : ""); input.addEventListener("input", updatePillarTotal); label.append(input); return label;
    };
    row.append(makeLabel("Nombre del pilar *", "name", "Ej. Educación"), makeLabel("Qué aporta / temas", "description", "Temas y función del pilar"), makeLabel("Distribución (%) *", "percentage", "0", "number"));
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "button button-secondary"; remove.textContent = "Quitar"; remove.setAttribute("aria-label", "Quitar pilar");
    remove.addEventListener("click", () => { row.remove(); updatePillarTotal(); }); row.append(remove); root.append(row); updatePillarTotal();
  }
  function readPillars() {
    return Array.from(document.querySelectorAll(".pillar-row")).map(row => {
      const value = key => row.querySelector(`[data-pillar-field="${key}"]`).value.trim();
      return { name: value("name"), description: value("description"), percentage: value("percentage") === "" ? NaN : Number(value("percentage")) };
    });
  }
  function validatePillars() {
    const pillars = readPillars();
    if (!pillars.length) return { ok:false, message:"Agrega al menos un pilar de comunicación." };
    if (pillars.some(p => !p.name || !Number.isFinite(p.percentage) || p.percentage < 0 || p.percentage > 100)) return { ok:false, message:"Cada pilar necesita nombre y un porcentaje entre 0 y 100." };
    const names = pillars.map(p => p.name.toLocaleLowerCase());
    if (new Set(names).size !== names.length) return { ok:false, message:"Hay nombres de pilares repetidos. Usa nombres únicos." };
    const total = pillars.reduce((sum,p) => sum + p.percentage, 0);
    if (total !== 100) return { ok:false, message:`La distribución suma ${total}%. Ajusta los porcentajes para que sumen exactamente 100%.` };
    return { ok:true, pillars };
  }
  function updatePillarTotal() {
    const root = $("#pillar-total"); if (!root) return;
    const pillars = readPillars(); const total = pillars.reduce((sum,p) => sum + (Number.isFinite(p.percentage) ? p.percentage : 0), 0);
    const result = validatePillars(); root.classList.toggle("valid", result.ok); root.classList.toggle("invalid", !result.ok);
    root.replaceChildren(); const b = document.createElement("b"); b.textContent = `Distribución: ${total}%`;
    const span = document.createElement("span"); span.textContent = result.ok ? "Correcto: la distribución suma 100%." : result.message;
    root.append(b, span);
  }
  $("#add-pillar")?.addEventListener("click", () => addPillar());
  $("#strategy-form").addEventListener("submit", async event => {
    event.preventDefault();
    const feedback = $("#strategy-feedback");
    if (!$("#goal").value || !$("#communicationGoal").value.trim() || !$("#audience").value.trim()) { feedback.textContent = "Completa la prioridad del negocio, el objetivo de comunicación y la audiencia."; return; }
    const validation = validatePillars(); updatePillarTotal();
    if (!validation.ok) { feedback.textContent = validation.message; return; }
    const data = await getData();
    data.strategy = {
      ...(data.strategy || {}), goal: $("#goal").value, horizon: $("#horizon").value,
      communicationGoal: $("#communicationGoal").value.trim(), kpi: $("#kpi").value.trim(), target: $("#target").value.trim(),
      audience: $("#audience").value.trim(), pillars: validation.pillars,
      primaryNetwork: $("#primaryNetwork").value, secondaryNetwork: $("#secondaryNetwork").value,
      networkRationale: $("#networkRationale").value.trim(), resources: $("#resources").value.trim()
    };
    data.strategySaved = true; data.strategyUpdatedAt = new Date().toISOString();
    const saved = await window.AppStorage.write(data);
    feedback.textContent = saved.ok ? "Estrategia guardada. La selección de redes es una hipótesis que deberás validar con resultados reales." : (saved.error || "No se pudo guardar la estrategia.");
    $("#save-status").textContent = saved.ok ? "Guardado en este navegador" : "Guardado no disponible";
    if (saved.ok && window.AppLearning) await window.AppLearning.updateProgress();
    if (saved.ok) window.dispatchEvent(new CustomEvent("content-commander:strategy-updated"));
  });
  async function restore() {
    const data = await getData();
    [["company",["company","sector","offer","mission","vision","values","valueProposition","difference","companyAudience","tone","personality","evidence","restrictions","notes"]], ["strategy",["goal","horizon","communicationGoal","kpi","target","audience","primaryNetwork","secondaryNetwork","networkRationale","resources"]]].forEach(([key, ids]) => {
      if (!data[key]) return; ids.forEach(id => { const el=$("#"+id); const dataKey = key === "company" && id === "companyAudience" ? "audience" : id; if(el && data[key][dataKey] !== undefined) el.value=data[key][dataKey]; });
    });
    const strategy = data.strategy || {}; const root = $("#pillars-list");
    if (root) { root.replaceChildren(); (Array.isArray(strategy.pillars) && strategy.pillars.length ? strategy.pillars : [{}]).forEach(addPillar); updatePillarTotal(); }
    updateCompanyCompleteness();
  }
  function updateCompanyCompleteness() {
    const root = $("#company-completeness"); if (!root) return;
    const ids = ["company","sector","offer","mission","vision","values","valueProposition","difference","companyAudience","tone","personality","evidence","restrictions"];
    const completed = ids.filter(id => { const el=$("#"+id); return el && el.value.trim(); }).length;
    const requiredOk = ["company","offer"].every(id => $("#"+id)?.value.trim());
    const heading = root.querySelector("b"), paragraph = root.querySelector("p");
    if (heading) heading.textContent = `${completed} de ${ids.length} campos clave completados`;
    if (paragraph) paragraph.textContent = requiredOk ? "La base mínima está cubierta. Los campos restantes pueden seguir pendientes; confirma siempre la evidencia de tus afirmaciones." : "Para completar la base mínima, añade el nombre de la empresa y qué ofrece. Los demás campos pueden quedar pendientes.";
    root.dataset.complete = requiredOk ? "true" : "false";
  }
  ["company","sector","offer","mission","vision","values","valueProposition","difference","companyAudience","tone","personality","evidence","restrictions","notes"].forEach(id => { const el=$("#"+id); if(el) el.addEventListener("input", updateCompanyCompleteness); });
  window.AppForms = { restore, updateCompanyCompleteness, addPillar, readPillars, validatePillars };
})();
