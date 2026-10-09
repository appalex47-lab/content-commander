/* Asistente pedagógico: propuestas explícitas, sin guardar ni sobrescribir datos automáticamente. */
(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const readData = async () => { const r = await window.AppStorage.read(); if (r.warning) throw new Error(r.warning); return r.data || {}; };
  const show = (root, text) => { root.replaceChildren(); const pre = document.createElement("pre"); pre.className = "ai-coach-text"; pre.textContent = text; root.append(pre); const copy = document.createElement("button"); copy.type = "button"; copy.className = "button button-secondary"; copy.textContent = "Copiar propuesta"; copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(text); copy.textContent = "Copiado"; } catch (_) { copy.textContent = "Selecciona y copia el texto"; } }); root.append(copy); root.hidden = false; };
  async function run(buttonId, statusId, resultId, buildPrompt, maxTokens=1300) {
    const button=$(buttonId), status=$(statusId), result=$(resultId); if (!button || !status || !result) return;
    button.disabled=true; const original=button.textContent; button.textContent="Preparando recomendación…"; status.textContent="La IA está analizando la información disponible. Puede tardar unos segundos."; result.hidden=true;
    try { const data=await readData(); if (!window.AppCohere) throw new Error("El módulo de Cohere no está disponible. Recarga la aplicación."); const response=await window.AppCohere.chat([{role:"user",content:buildPrompt(data)}],{maxTokens,temperature:0.25}); show(result,response.text); status.textContent=`Propuesta recibida de ${response.model}. No se ha guardado ni aplicado ningún cambio; revisa y copia lo que te sirva.`; }
    catch(e) { status.textContent=e.message || "No se pudo obtener la propuesta."; status.dataset.state="error"; }
    finally { button.disabled=false; button.textContent=original; }
  }
  const rules = `Responde en español claro para una persona principiante. Explica con palabras sencillas y evita jerga sin definirla. No inventes hechos de empresa, clientes, pruebas, estadísticas ni resultados. Separa claramente: (1) lo que sabemos por los datos aportados, (2) propuestas/hipótesis de trabajo, (3) preguntas concretas que la persona puede responder y (4) qué debe validar antes de aprobar. Si falta información, dilo explícitamente y usa [POR VALIDAR]. No afirmes que una propuesta es un hecho comprobado. Da recomendaciones concretas, accionables y adaptadas al contexto disponible, no una plantilla genérica.`;
  const companyFieldMap = {
    sector: "sector", mission: "mission", vision: "vision", values: "values",
    valueProposition: "valueProposition", difference: "difference", audience: "companyAudience",
    tone: "tone", personality: "personality", evidence: "evidence", restrictions: "restrictions", notes: "notes"
  };
  function parseJsonResponse(raw) {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("La IA respondió, pero no devolvió el perfil estructurado esperado. Vuelve a intentarlo.");
    try { return JSON.parse(cleaned.slice(start, end + 1)); }
    catch (_) { throw new Error("La respuesta de la IA no llegó en un formato que pueda rellenar automáticamente. Vuelve a intentarlo."); }
  }
  function fillCompanyFields(profile) {
    const applied = [], preserved = [], pending = [];
    Object.entries(companyFieldMap).forEach(([key, id]) => {
      const el = $("#" + id); if (!el) return;
      const value = typeof profile[key] === "string" ? profile[key].trim() : "";
      if (!value) { pending.push(id); return; }
      if (el.value.trim()) { preserved.push(id); return; }
      if (el.tagName === "SELECT" && !Array.from(el.options).some(option => option.value === value || option.text === value)) {
        const notes = $("#notes");
        if (notes && !notes.value.trim()) { notes.value = `Tono sugerido por IA: ${value} [POR VALIDAR]`; applied.push("notes"); }
        pending.push(id); return;
      }
      el.value = value; applied.push(id); el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    if (window.AppForms) window.AppForms.updateCompanyCompleteness();
    return { applied, preserved, pending };
  }
  async function completeCompanyProfile() {
    const button = $("#coach-company"), status = $("#coach-company-status"), result = $("#coach-company-result");
    if (!button || !status || !result) return;
    button.disabled = true; button.textContent = "Completando perfil…"; status.textContent = "La IA está preparando texto para los campos vacíos. No inventará el nombre ni la oferta de tu empresa."; status.dataset.state = ""; result.hidden = true;
    try {
      const data = await readData();
      if (!window.AppCohere) throw new Error("El módulo de Cohere no está disponible. Recarga la aplicación.");
      const existing = { ...(data.company || {}) };
      ["company", "sector", "offer", "mission", "vision", "values", "valueProposition", "difference", "audience", "tone", "personality", "evidence", "restrictions", "notes"].forEach(key => {
        const id = key === "audience" ? "companyAudience" : key;
        if ($("#" + id)) existing[key] = $("#" + id).value.trim();
      });
      const prompt = `${rules}

Eres un asesor que rellena el formulario de perfil empresarial para una persona principiante. Devuelve ÚNICAMENTE un objeto JSON válido, sin Markdown ni texto antes/después, con estas claves string: sector, mission, vision, values, valueProposition, difference, audience, tone, personality, evidence, restrictions, notes.

Datos actuales del formulario: ${JSON.stringify(existing, null, 2)}

REGLAS PARA RELLENAR: redacta una propuesta útil en todos los campos que puedas inferir con prudencia. No cambies ni devuelvas claves company ni offer: el nombre y la oferta real deben venir de la persona. Para datos que no se conocen, escribe una pregunta o “[POR VALIDAR] ...” en el campo correspondiente, no inventes hechos. Diferenciadores: formula posibilidades a comprobar, nunca los declares comprobados si no hay evidencia. Propuesta de valor: borrador claramente provisional basado en la oferta existente; si no hay oferta, indica qué dato falta. Audiencia: ofrece un segmento candidato explícitamente hipotético y qué dato confirmaría si es prioritario. Misión, visión, valores y personalidad son borradores propuestos, no hechos de la empresa. En evidence indica qué evidencia se necesita o qué se ha proporcionado; no inventes certificaciones, resultados ni estudios. En restrictions incluye afirmaciones que conviene no realizar hasta comprobarlas y solicita confirmar restricciones regulatorias relevantes. En notes resume supuestos y preguntas prioritarias. Cada valor debe ser texto sencillo. El campo tone debe ser exactamente una de estas opciones si encaja: “Claro y cercano”, “Profesional y experto”, “Educativo y didáctico”, “Cálido y empático”, “Enérgico e inspirador”, “Formal e institucional”; si no, usa “Claro y cercano” y aclara en notes que es provisional. No sobrescribas datos confirmados: el sistema solo aplicará estos resultados a campos que estén vacíos.`;
      const response = await window.AppCohere.chat([{ role: "user", content: prompt }], { maxTokens: 1800, temperature: 0.2 });
      const profile = parseJsonResponse(response.text);
      const counts = fillCompanyFields(profile);
      result.replaceChildren();
      const summary = document.createElement("p"); summary.className = "ai-coach-text";
      summary.textContent = `Perfil rellenado con una propuesta de ${response.model}. Campos completados: ${counts.applied.length}. Campos que ya tenían información y se conservaron: ${counts.preserved.length}. Campos pendientes de completar o revisar: ${counts.pending.length}. Revisa especialmente todo lo marcado [POR VALIDAR].`;
      const saveHint = document.createElement("p"); saveHint.textContent = "Los cambios están en el formulario, pero todavía no se han guardado. Revisa el contenido y pulsa «Guardar perfil maestro» cuando estés conforme. El nombre y la oferta no se inventan y deben completarse manualmente si están vacíos.";
      result.append(summary, saveHint); result.hidden = false;
      status.textContent = `La IA rellenó ${counts.applied.length} campos vacíos. Se conservaron ${counts.preserved.length} campos existentes.`; status.dataset.state = "success";
    } catch (e) { status.textContent = e.message || "No se pudo completar el perfil."; status.dataset.state = "error"; }
    finally { button.disabled = false; button.textContent = "Ayúdame a completar mi perfil →"; }
  }
  $("#coach-company")?.addEventListener("click", completeCompanyProfile);

  window.AppAssistant = { run };
})();
