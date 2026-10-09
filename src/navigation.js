(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  function navigate(view) {
    if (!$(`#view-${view}`)) view = "inicio";
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
    document.querySelectorAll("[data-route]").forEach(el => {
      const active = el.dataset.route === view && el.classList.contains("nav-link");
      el.classList.toggle("active", active);
    });
    $("#crumb").textContent = ({inicio:"Inicio",empresa:"Mi empresa",estrategia:"Estrategia",contenidos:"Contenidos",calendario:"Calendario",aprendizaje:"Aprendizaje",ajustes:"Ajustes"})[view] || "Inicio";
    $("#sidebar").classList.remove("open");
    $("#menu-button").setAttribute("aria-expanded", "false");
    if (location.hash !== `#${view}`) history.replaceState(null, "", `#${view}`);
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  document.addEventListener("click", event => {
    const link = event.target.closest("[data-route]");
    if (!link) return;
    event.preventDefault();
    navigate(link.dataset.route);
  });
  $("#menu-button").addEventListener("click", () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#menu-button").setAttribute("aria-expanded", String(open));
  });
  window.AppNavigation = { navigate };
})();