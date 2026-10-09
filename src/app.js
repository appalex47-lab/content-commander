(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const result = window.AppStorage.read();
  if (result.warning) $("#save-status").textContent = result.warning;
  else $("#save-status").textContent = "Listo";
  if (window.AppForms) window.AppForms.restore();
  if (window.AppLearning) window.AppLearning.restore();
  const hash = location.hash.slice(1);
  if (hash && $("#view-"+hash) && window.AppNavigation) window.AppNavigation.navigate(hash);
})();