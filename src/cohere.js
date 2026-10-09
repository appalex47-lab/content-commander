/* Fase 3: integración directa con Cohere Chat API v2. La clave se mantiene fuera de IndexedDB y de los respaldos. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const CONFIG_KEY = "content-commander-cohere-config-v1";
  const DEFAULT_MODEL = "command-a-plus-05-2026";
  const MODELS = new Set(["command-a-plus-05-2026", "command-a-reasoning-08-2025", "command-a-03-2025", "command-r7b-12-2024"]);
  let currentDraftText = "";

  function loadConfig() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
      return { apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "", model: MODELS.has(parsed.model) ? parsed.model : DEFAULT_MODEL };
    } catch (_) { return { apiKey: "", model: DEFAULT_MODEL }; }
  }
  function saveConfig(config) {
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify({ apiKey: config.apiKey.trim(), model: MODELS.has(config.model) ? config.model : DEFAULT_MODEL })); return true; }
    catch (_) { return false; }
  }
  function feedback(message, error = false) {
    const node = $("#cohere-feedback");
    if (node) { node.textContent = message; node.dataset.state = error ? "error" : "success"; }
  }
  function contentFeedback(message, error = false) {
    const node = $("#content-feedback");
    if (node) { node.textContent = message; node.dataset.state = error ? "error" : "success"; }
  }
  function getKeyFromInput() { return $("#cohere-api-key").value.trim() || loadConfig().apiKey; }
  function getModel() { const value = $("#cohere-model")?.value || loadConfig().model; return MODELS.has(value) ? value : DEFAULT_MODEL; }
  function explainError(status, body) {
    if (status === 401 || status === 498) return "Cohere rechazó la clave. Revisa que esté completa, vigente y corresponda a tu cuenta.";
    if (status === 403) return "Cohere denegó el acceso. Comprueba permisos, disponibilidad del modelo y restricciones de tu cuenta.";
    if (status === 429) return "Se alcanzó un límite de uso de Cohere. Espera antes de volver a intentarlo.";
    if (status === 400 || status === 422) return "Cohere no aceptó la solicitud. Revisa el modelo y el contenido enviado.";
    if (status >= 500) return "Cohere reportó un problema temporal. Inténtalo más tarde.";
    return body || `La solicitud falló (HTTP ${status}).`;
  }
  async function chat(messages, options = {}) {
    const apiKey = options.apiKey || getKeyFromInput();
    const model = options.model || getModel();
    if (!apiKey) throw new Error("Añade y guarda una API key en Ajustes antes de usar Cohere.");
    if (!MODELS.has(model)) throw new Error("Selecciona un modelo válido.");
    let response;
    try {
      response = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Client-Name": "Content Commander" },
        body: JSON.stringify({ model, messages, max_tokens: options.maxTokens || 1200, temperature: options.temperature ?? 0.35 }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined
      });
    } catch (error) {
      if (error && error.name === "TimeoutError") throw new Error("La solicitud tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.");
      throw new Error("No se pudo conectar con Cohere. Comprueba internet y si el navegador permite la petición (CORS/red). No se ha simulado una respuesta.");
    }
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; } catch (_) { data = {}; }
    if (!response.ok) {
      const detail = data.message || data.error?.message || "";
      throw new Error(explainError(response.status, detail));
    }
    const text = Array.isArray(data.message?.content) ? data.message.content.filter(part => part.type === "text").map(part => part.text).join("\n") : "";
    if (!text.trim()) throw new Error("Cohere respondió, pero no devolvió texto. Revisa el modelo e inténtalo otra vez.");
    return { text: text.trim(), id: data.id || null, model, usage: data.usage || null };
  }
  async function saveDraft(draft) {
    const state = await window.AppStorage.read();
    if (state.warning) throw new Error(state.warning);
    const data = state.data || {};
    const drafts = Array.isArray(data.contentDrafts) ? data.contentDrafts.slice() : [];
    drafts.unshift(draft);
    data.contentDrafts = drafts.slice(0, 100);
    const result = await window.AppStorage.write(data);
    if (!result.ok) throw new Error(result.error || "No se pudo guardar el borrador.");
  }
  function safeText(element, value) { element.textContent = value; }
  function renderDrafts(drafts) {
    const root = $("#saved-drafts");
    if (!root) return;
    root.replaceChildren();
    if (!drafts.length) { const p = document.createElement("p"); p.className = "helper"; p.textContent = "Todavía no hay borradores guardados."; root.append(p); return; }
    drafts.forEach((draft) => {
      const card = document.createElement("article"); card.className = "saved-draft";
      const title = document.createElement("b"); title.textContent = `${draft.typeLabel || "Contenido"} · ${draft.network || "Red por definir"}`;
      const meta = document.createElement("p"); meta.className = "helper"; meta.textContent = `${draft.createdAt ? new Date(draft.createdAt).toLocaleString() : "Fecha no disponible"} · Pendiente de revisión humana`;
      const body = document.createElement("p"); body.textContent = (draft.text || "").slice(0, 260) + ((draft.text || "").length > 260 ? "…" : "");
      const button = document.createElement("button"); button.type = "button"; button.className = "button button-secondary"; button.textContent = "Ver borrador";
      button.addEventListener("click", () => { currentDraftText = draft.text || ""; $("#draft-result").textContent = currentDraftText; $("#draft-panel").hidden = false; $("#draft-panel").scrollIntoView({ behavior: "smooth", block: "start" }); });
      card.append(title, meta, body, button); root.append(card);
    });
  }
  async function refreshDrafts() {
    try { const state = await window.AppStorage.read(); renderDrafts(Array.isArray(state.data?.contentDrafts) ? state.data.contentDrafts : []); }
    catch (_) { renderDrafts([]); }
  }
  function init() {
    const config = loadConfig();
    if ($("#cohere-model")) $("#cohere-model").value = config.model;
    // Never populate the password field automatically; show only a saved/not-saved state.
    if ($("#cohere-api-key")) $("#cohere-api-key").placeholder = config.apiKey ? "Hay una clave guardada; pega otra para reemplazarla" : "Pega tu API key";
    if ($("#cohere-settings-form")) $("#cohere-settings-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const apiKey = $("#cohere-api-key").value.trim() || loadConfig().apiKey;
      if (!apiKey) { feedback("Introduce una API key antes de guardar.", true); return; }
      const ok = saveConfig({ apiKey, model: getModel() });
      if (!ok) { feedback("El navegador no permitió guardar la configuración local.", true); return; }
      $("#cohere-api-key").value = "";
      $("#cohere-api-key").placeholder = "Hay una clave guardada; pega otra para reemplazarla";
      feedback("Configuración guardada en este navegador. La clave no se ha probado todavía.");
    });
    $("#test-cohere")?.addEventListener("click", async () => {
      const button = $("#test-cohere"); button.disabled = true; feedback("Probando la conexión con una solicitud mínima…");
      try {
        const result = await chat([{ role: "user", content: "Responde únicamente: conexión correcta." }], { maxTokens: 30, temperature: 0 });
        feedback(`Conexión correcta con ${result.model}. Respuesta recibida de Cohere.`);
      } catch (error) { feedback(error.message || "No se pudo probar la conexión.", true); }
      finally { button.disabled = false; }
    });
    $("#clear-cohere")?.addEventListener("click", () => {
      try { localStorage.removeItem(CONFIG_KEY); $("#cohere-api-key").value = ""; $("#cohere-api-key").placeholder = "Pega tu API key"; feedback("Clave y configuración de Cohere eliminadas de este navegador."); }
      catch (_) { feedback("El navegador no permitió eliminar la configuración.", true); }
    });
    $("#content-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const topic = $("#content-topic").value.trim();
      if (!topic) { contentFeedback("Describe el tema antes de generar.", true); return; }
      const button = $("#generate-content"); button.disabled = true; button.textContent = "Generando…";
      contentFeedback("Enviando el contexto a Cohere. Puede tardar unos segundos.");
      try {
        const state = await window.AppStorage.read();
        const data = state.data || {};
        const company = data.company || {};
        const strategy = data.strategy || {};
        const type = $("#content-type").value;
        const typeLabel = $("#content-type").selectedOptions[0].textContent;
        const network = $("#content-network").value;
        const goal = $("#content-goal").value;
        const audience = $("#content-audience").value.trim() || strategy.audience || "No definida; no inventar características demográficas.";
        const instructions = $("#content-instructions").value.trim() || "No hay instrucciones adicionales.";
        const prompt = `Actúa como estratega de contenidos en español. Genera un borrador útil para revisión humana.\n\nREGLAS OBLIGATORIAS:\n- No inventes hechos, estadísticas, testimonios, resultados, credenciales, características de productos ni datos de empresa. Si falta información, marca [POR VALIDAR] o formula una pregunta.\n- Distingue hechos proporcionados de sugerencias e hipótesis.\n- No afirmes que se han verificado tendencias o fuentes externas.\n- No uses promesas absolutas ni afirmaciones engañosas.\n- Incluye objetivo, propuesta de pieza, copy/guion, CTA opcional y puntos que la persona debe verificar.\n- Devuelve solo el borrador estructurado, sin afirmar que está aprobado.\n\nCONTEXTO CONFIRMADO DE EMPRESA:\nNombre: ${company.company || "No indicado"}\nSector: ${company.sector || "No indicado"}\nOferta: ${company.offer || "No indicada"}\nMisión: ${company.mission || "No indicada"}\nVisión: ${company.vision || "No indicada"}\nValores: ${company.values || "No indicados"}\nPropuesta de valor: ${company.valueProposition || "No indicada"}\nDiferenciadores comprobables: ${company.difference || "No indicados"}\nAudiencia prioritaria confirmada: ${company.audience || "No indicada"}\nTono de comunicación: ${company.tone || "Por definir"}\nPersonalidad de marca: ${company.personality || "No indicada"}\nEvidencia disponible: ${company.evidence || "No indicada; marcar afirmaciones como [POR VALIDAR]"}\nRestricciones y afirmaciones a evitar: ${company.restrictions || "No indicadas; no asumir permisos ni hacer promesas no respaldadas"}\nNotas adicionales: ${company.notes || "Ninguna"}\nObjetivo estratégico: ${strategy.goal || "No definido"}\n\nSOLICITUD:\nFormato: ${typeLabel}\nRed: ${network}\nObjetivo de esta pieza: ${goal}\nAudiencia: ${audience}\nTema y datos aportados por la persona: ${topic}\nInstrucciones: ${instructions}`;
        const result = await chat([{ role: "user", content: prompt }], { maxTokens: 1400 });
        currentDraftText = result.text;
        safeText($("#draft-result"), currentDraftText); $("#draft-panel").hidden = false;
        const draft = { id: (crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`), createdAt: new Date().toISOString(), type, typeLabel, network, goal, audience, topic, model: result.model, requestId: result.id, text: result.text, status: "pending-human-review", approved: false };
        await saveDraft(draft); await refreshDrafts();
        contentFeedback("Borrador generado y guardado. Estado: pendiente de revisión humana; no se ha publicado.");
        $("#draft-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) { contentFeedback(error.message || "No se pudo generar el borrador.", true); }
      finally { button.disabled = false; button.textContent = "Generar borrador con Cohere →"; }
    });
    $("#copy-draft")?.addEventListener("click", async () => {
      if (!currentDraftText) return;
      try { await navigator.clipboard.writeText(currentDraftText); contentFeedback("Borrador copiado. Recuerda revisarlo antes de usarlo."); }
      catch (_) { contentFeedback("No se pudo copiar automáticamente. Selecciona el texto del borrador y cópialo manualmente.", true); }
    });
    window.AppCohere = { chat, loadConfig, saveConfig, refreshDrafts, constants: { CONFIG_KEY, DEFAULT_MODEL, MODELS: Array.from(MODELS) } };
    window.AppStorage?.init?.().then(refreshDrafts).catch(() => {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
