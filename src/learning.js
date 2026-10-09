(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const state = { quizPassed: false, briefSaved: false, lessonReviewed: false };
  const answerKey = { q1:1, q2:0, q3:2, q4:1, q5:1 };
  async function getData() { const result = await window.AppStorage.read(); return result.data || {}; }
  async function persist() {
    const data = await getData(); data.learning = { ...state };
    const result = await window.AppStorage.write(data);
    $("#save-status").textContent = result.ok ? "Guardado en este navegador" : "Guardado no disponible";
    return result.ok;
  }
  async function updateProgress() {
    const data = await getData();
    const steps = [Boolean(data.profileSaved || data.companySaved), state.lessonReviewed, Boolean(data.strategySaved || data.strategySaved === true), state.briefSaved, state.quizPassed];
    const count = steps.filter(Boolean).length;
    $("#progress-count").textContent = `${count} de ${steps.length} pasos`;
    $("#progress-bar").style.width = `${count/steps.length*100}%`;
  }
  $("#brief-form").addEventListener("submit", async event => {
    event.preventDefault();
    const ids = ["brief-company","brief-offer","brief-audience","brief-problem","brief-goal","brief-horizon","brief-evidence"];
    const brief = Object.fromEntries(ids.map(id => [id, $("#"+id).value.trim()]));
    const substantive = ["brief-company","brief-offer","brief-audience","brief-problem"].filter(id => brief[id]).length;
    state.briefSaved = substantive >= 2;
    const data = await getData(); data.brief = brief; data.learning = {...state};
    const saved = await window.AppStorage.write(data);
    $("#brief-feedback").textContent = !state.briefSaved ? "Completa al menos dos campos descriptivos. Si no sabes una respuesta, indícala como pendiente." : saved.ok ? "Brief guardado como borrador. Confirma qué respuestas son hechos y cuáles son hipótesis." : saved.error;
    $("#save-status").textContent = saved.ok ? "Guardado en este navegador" : "Guardado no disponible";
    await updateProgress();
  });
  $("#quiz-form").addEventListener("submit", async event => {
    event.preventDefault(); let score=0, unanswered=0;
    Object.entries(answerKey).forEach(([name, correct]) => {
      const chosen = $(`input[name="${name}"]:checked`);
      const fieldset = $(`input[name="${name}"]`).closest("fieldset");
      const feedback = $(".quiz-feedback", fieldset);
      if (!chosen) { unanswered++; feedback.textContent = "Selecciona una respuesta."; return; }
      const ok = Number(chosen.value) === correct; if (ok) score++;
      feedback.textContent = ok ? "Correcto." : "Repasa el concepto y vuelve a intentarlo.";
    });
    state.quizPassed = unanswered === 0 && score >= 4;
    $("#quiz-result").textContent = unanswered ? `Responde las ${unanswered} pregunta(s) pendiente(s).` : state.quizPassed ? `¡Bien hecho! ${score}/5. Has alcanzado el criterio de comprensión.` : `Resultado: ${score}/5. Necesitas al menos 4/5. Revisa la lección e inténtalo otra vez.`;
    await persist(); await updateProgress();
  });
  $("#mark-lesson").addEventListener("click", async () => {
    if (!state.quizPassed || !state.briefSaved) { $("#lesson-status").textContent = "Guarda el brief y consigue al menos 4/5 en el cuestionario para cumplir los criterios."; return; }
    state.lessonReviewed = true; await persist(); await updateProgress();
    $("#lesson-status").textContent = "Criterios cumplidos. Tu progreso se guardó localmente.";
  });
  document.querySelectorAll("[data-lesson]").forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.lesson !== "0") { $("#toast").textContent = "Esta lección se desarrollará en una fase posterior."; $("#toast").classList.add("show"); setTimeout(() => $("#toast").classList.remove("show"), 2200); }
    else { document.querySelectorAll("[data-lesson]").forEach(b => b.classList.toggle("selected", b===btn)); $("#lesson-content").scrollIntoView({behavior:"smooth", block:"start"}); }
  }));
  async function restore() {
    const data = await getData(); const learning = data.learning || {};
    Object.keys(state).forEach(k => state[k] = Boolean(learning[k]));
    if (data.brief) Object.entries(data.brief).forEach(([id,value]) => { const el=$("#"+id); if(el) el.value=value || ""; });
    if (state.lessonReviewed) $("#lesson-status").textContent = "Lección marcada como revisada.";
    await updateProgress();
  }
  window.AppLearning = { restore, updateProgress };
})();
