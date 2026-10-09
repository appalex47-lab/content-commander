(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  async function start() {
    let result;
    try { result = await window.AppStorage.init(); }
    catch (error) { result = { warning: error.message || "IndexedDB no está disponible." }; }
    $("#save-status").textContent = result.warning || "Almacenamiento local listo";
    if (result.warning) $("#storage-notice").textContent = result.warning;
    if (window.AppForms) await window.AppForms.restore();
    if (window.AppLearning) await window.AppLearning.restore();
    const hash = location.hash.slice(1);
    if (hash && $("#view-"+hash) && window.AppNavigation) window.AppNavigation.navigate(hash);
  }
  start();
})();
