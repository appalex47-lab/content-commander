# Fase 7 — Guardián de calidad y aprobación humana

## Objetivo

Agregar un flujo editorial explícito para revisar borradores, registrar aprobación/rechazo y conservar versiones sin publicar automáticamente.

## Modelo de datos

Cada elemento `data.contentDrafts[]` conserva los campos previos y añade opcionalmente:

- `status`: `pending-human-review`, `approved` o `rejected`.
- `approved`: booleano compatible con el esquema previo.
- `approvedAt` / `rejectedAt`: fecha ISO de la decisión correspondiente.
- `rejectionReason`: motivo escrito por la persona revisora.
- `reviewChecklist`: estado de seis verificaciones editoriales.
- `history`: versiones anteriores con `text`, `at`, `reason` y `status`.
- `version`: número de versión y `updatedAt` para la última alternativa.

Los campos son aditivos y opcionales; no requiere migrar IndexedDB ni cambiar el esquema del backup. Los borradores anteriores que no tengan `status` se interpretan como pendientes salvo que `approved` sea true.

## Flujo editorial

1. Abrir un borrador desde la lista.
2. Revisar seis puntos: hechos, tono, audiencia/red, CTA, restricciones/derechos/datos sensibles y marcadores pendientes.
3. Aprobar solo después de marcar los seis puntos. La aprobación es una decisión humana registrada localmente; no equivale a validación legal ni publicación.
4. Rechazar requiere motivo obligatorio.
5. Generar alternativa requiere motivo. Se envían a Cohere el formato, objetivo, red, audiencia, tema, pilar, instrucciones y texto original. Las instrucciones piden preservar el contexto original y modificar lo necesario según el rechazo.
6. La alternativa se guarda como nueva versión del mismo borrador; la versión anterior queda en `history`, el estado vuelve a pendiente y la lista editorial se reinicia.

## Seguridad y límites

- El texto generado y el historial se insertan con `textContent`, no como HTML.
- No existe integración de publicación en redes.
- El checklist es una ayuda de proceso, no una verificación automática de hechos, derechos o cumplimiento normativo.
- La alternativa depende de Cohere real y conexión del navegador. Si falla la petición, no se simula ni se guarda una respuesta ficticia.
- IndexedDB es local a este navegador/origen; exportar respaldos sigue siendo necesario.
