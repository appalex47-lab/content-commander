/* Fase 9: dashboard editorial diario basado únicamente en datos guardados. */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  const shiftDate = (iso, days) => { const d=new Date(`${iso}T12:00:00`); d.setDate(d.getDate()+days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  const el = (tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
  const routeButton = (route, label, cls="button button-secondary") => { const b=el("button",cls,label); b.type="button"; b.dataset.route=route; return b; };
  async function load(){
    const status=await window.AppStorage.read(); if(status.warning) throw new Error(status.warning);
    const data=status.data||{}, plan=Array.isArray(data.editorialPlan)?data.editorialPlan:[], drafts=Array.isArray(data.contentDrafts)?data.contentDrafts:[];
    const day=today(), end=shiftDate(day,7), active=plan.filter(x=>x.status!=="cancelled");
    const due=active.filter(x=>x.date===day&&x.status!=="published");
    const overdue=active.filter(x=>x.date<day&&!['published','cancelled'].includes(x.status));
    const pendingDrafts=drafts.filter(x=>x.status==='pending-human-review'||(!x.status&&!x.approved));
    const approved=active.filter(x=>x.status==='approved');
    const metrics=$("#dashboard-metrics"); if(!metrics)return; metrics.replaceChildren();
    const metric=(label,value,detail,route)=>{const card=el("article","dashboard-metric");card.append(el("span","",label),el("strong","",String(value)),el("small","",detail));if(route){card.tabIndex=0;card.setAttribute("role","link");card.setAttribute("aria-label",`${label}: ${value}. Abrir ${route==='calendario'?'calendario':'contenidos'}`);card.addEventListener("click",()=>window.AppNavigation?.navigate(route));card.addEventListener("keydown",e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.AppNavigation?.navigate(route);}});}metrics.append(card);};
    metric("Para hoy",due.length,"Piezas activas con fecha de hoy","calendario");metric("Atrasadas",overdue.length,"No publicadas con fecha anterior","calendario");metric("Revisión pendiente",pendingDrafts.length,"Borradores que necesitan decisión editorial","contenidos");metric("Aprobadas sin publicar",approved.length,"Aprobación no equivale a publicación","calendario");
    $("#dashboard-date").textContent=new Date(`${day}T12:00:00`).toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"});
    const priorities=$("#dashboard-priorities");priorities.replaceChildren();
    const priorityRows=[];
    if(overdue.length)priorityRows.push({title:`Revisar ${overdue.length} pieza(s) atrasada(s)`,detail:"Confirma si siguen vigentes, reprograma su fecha o registra su publicación real.",route:"calendario"});
    if(pendingDrafts.length)priorityRows.push({title:`Revisar ${pendingDrafts.length} borrador(es)`,detail:"Comprueba hechos, tono, audiencia, CTA y restricciones antes de aprobar o rechazar.",route:"contenidos"});
    if(due.length)priorityRows.push({title:`Atender ${due.length} pieza(s) de hoy`,detail:"Verifica recursos, aprobación y estado antes de cerrar el día.",route:"calendario"});
    if(!priorityRows.length)priorityRows.push({title:"No hay alertas prioritarias detectadas",detail:"Puedes planificar nuevas piezas o revisar el calendario de la próxima semana.",route:"calendario"});
    priorityRows.slice(0,4).forEach(r=>{const row=el("div","dashboard-list-item");const copy=el("div");copy.append(el("b","",r.title),el("p","",r.detail));row.append(copy,routeButton(r.route,"Abrir →","text-button"));priorities.append(row);});
    const upcoming=$("#dashboard-upcoming");upcoming.replaceChildren();const next=active.filter(x=>x.date>=day&&x.date<=end&&x.status!=="published").sort((a,b)=>(a.date+(a.time||"00:00")).localeCompare(b.date+(b.time||"00:00"))).slice(0,6);
    if(!next.length)upcoming.append(el("p","helper","No hay piezas activas en los próximos 7 días. Puedes añadir una desde Calendario."));
    next.forEach(item=>{const row=el("div","dashboard-list-item upcoming-item");const date=el("span","upcoming-date",item.date===day?"HOY":new Date(`${item.date}T12:00:00`).toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"}));const copy=el("div");copy.append(el("b","",item.title),el("p","",[item.time,item.network,item.pillar||"Pilar por definir",({planned:"Planificado",approved:"Aprobado","pending-human-review":"Pendiente de revisión"})[item.status]||item.status].filter(Boolean).join(" · ")));row.append(date,copy);upcoming.append(row);});
    const readiness=$("#dashboard-readiness");readiness.replaceChildren();const company=data.company||{},strategy=data.strategy||{};const missing=[];if(!company.company||!company.offer)missing.push("completar el perfil de empresa");if(!Array.isArray(strategy.pillars)||!strategy.pillars.length)missing.push("definir los pilares estratégicos");if(!active.length)missing.push("crear las primeras piezas del calendario");if(missing.length){readiness.append(el("b","","Para sacar más provecho a tu espacio"),el("p","",`Te recomendamos ${missing.join(", ")}. Esto es una guía de configuración, no una calificación de la estrategia.`));const links=el("div","dashboard-readiness-actions");if(!company.company||!company.offer)links.append(routeButton("empresa","Completar empresa"));if(!Array.isArray(strategy.pillars)||!strategy.pillars.length)links.append(routeButton("estrategia","Definir estrategia"));if(!active.length)links.append(routeButton("calendario","Planificar piezas"));readiness.append(links);}else readiness.append(el("b","","Tu espacio ya tiene una base de trabajo"),el("p","","Sigue revisando pendientes y registra manualmente las publicaciones realizadas. Las métricas de este panel reflejan registros locales, no resultados de redes sociales."));
  }
  async function refresh(){try{await load();}catch(e){const n=$("#dashboard-priorities");if(n)n.textContent=`No se pudo cargar el dashboard: ${e.message||"error de almacenamiento"}`;}}
  document.addEventListener("DOMContentLoaded",()=>{refresh();window.addEventListener("focus",refresh);window.addEventListener("content-commander:dashboard-updated",refresh);window.addEventListener("content-commander:route-changed",refresh);window.addEventListener("content-commander:strategy-updated",refresh);window.addEventListener("content-commander:drafts-updated",refresh);});
  window.AppDashboard={refresh};
})();
