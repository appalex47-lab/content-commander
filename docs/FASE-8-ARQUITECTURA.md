# Fase 8 — Plan mensual y calendario editorial

## Objetivo
Convertir la estrategia guardada en un plan editorial accionable sin publicar automáticamente ni inferir resultados.

## Datos y persistencia
Los elementos se almacenan en `data.editorialPlan` dentro del registro de trabajo de IndexedDB existente. Como el respaldo JSON exporta la sección `data` completa, el calendario queda incluido sin cambiar el esquema global ni la versión del backup.

Cada elemento incluye `id`, `title`, `date` (YYYY-MM-DD), `time` opcional, `network`, `format`, `pillar`, `goal`, `owner`, `draftId` opcional, `notes`, `status`, `createdAt`, `statusUpdatedAt` y `publishedAt` solo cuando una persona confirma publicación.

Estados válidos: `planned`, `pending-human-review`, `approved`, `published`, `cancelled`. Estado `approved` del calendario es editorial y no es publicación. `published` requiere confirmación explícita y queda registrado manualmente; no se conecta con plataformas sociales.

## Reglas
- Título, fecha, red y formato son obligatorios.
- Solo borradores con estado aprobado pueden vincularse. Un borrador aprobado sigue sin estar publicado.
- El plan permite crear piezas aunque no exista un borrador.
- El filtro mensual y el filtro de estado solo afectan la vista, no eliminan datos.
- La distribución de pilares se calcula con piezas del mes no canceladas; se compara el porcentaje observado con la intención estratégica guardada. No crea publicaciones automáticamente ni predice rendimiento. Las piezas sin pilar permanecen visibles como metadato pendiente.
- Todos los textos de usuario se renderizan mediante `textContent`; no se usa `innerHTML`.
- Los datos se guardan en el navegador/origen actual. Exportar respaldo para migrarlos a otro dispositivo.

## Módulos
- `index.html`: formulario de alta, filtros, resumen, distribución por pilar y lista de elementos.
- `src/calendar.js`: lectura/escritura, validación, estados, filtros y renderizado seguro.
- `src/cohere.js`: emite evento al cambiar borradores para refrescar vínculos aprobados.
- `styles.css`: tarjetas, estados, distribución y responsive móvil.

## Limitaciones conocidas
- No hay sincronización con calendarios externos ni publicación/programación real en redes.
- No hay vista semanal tipo cuadrícula ni arrastrar-y-soltar; la lista mensual ordenada por fecha es la primera versión funcional.
- No hay usuarios ni permisos multiusuario; responsable es texto informativo.
- La distribución de pilares no fuerza exactamente las proporciones; es una señal para revisar el plan.
