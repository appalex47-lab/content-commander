# Fase 11 — Analítica y aprendizaje editorial

## Objetivo
Registrar métricas que la persona usuaria consulta manualmente, resumirlas descriptivamente y convertir observaciones en hipótesis/experimentos documentados. No conecta APIs de redes sociales ni importa métricas automáticamente.

## Componentes
- `index.html`: navegación, formulario de métricas, resumen, filtro por red y formulario de aprendizajes.
- `src/analytics.js`: validación, persistencia, promedios descriptivos, agrupación por formato + objetivo, gestión de registros y aprendizajes.
- `styles.css`: tarjetas, resumen y diseño responsive.
- `src/storage.js`: persistencia IndexedDB existente; no se cambia `DB_VERSION`.

## Contrato de datos
`data.analyticsRecords[]`:
- `id`, `title`, `date`, `network`, `format`, `goal`, `pillar`, `notes`, `createdAt`.
- `reach`, `impressions`, `engagements`, `clicks`, `conversions`: entero no negativo o `null` si no se dispone del dato.

`data.editorialLearnings[]`:
- `id`, `recordId`, `recordTitle`, `type` (`observation`, `hypothesis`, `experiment`, `decision`), `text`, `nextStep`, `createdAt`.

Los datos forman parte de la sección `data` y, por tanto, del mecanismo existente de respaldo JSON. No se incluyen credenciales API.

## Reglas de cálculo
- Los valores vacíos se guardan como `null`, nunca se sustituyen por cero.
- Se rechazan valores negativos, decimales y no finitos.
- Cada promedio utiliza exclusivamente registros que tienen dato para esa métrica; se indica el número de registros con dato.
- Las tarjetas comparativas agrupan por combinación de formato y objetivo, y solo muestran grupos con al menos dos publicaciones.
- Son resúmenes descriptivos, no pruebas de causalidad ni benchmarks de mercado. No se atribuyen conversiones a un contenido si no hay registro que las respalde.
- Los resultados son manuales y dependen de la exactitud de quien los introduce.

## Limitaciones conocidas
- No hay conexión OAuth/API con Meta, TikTok, LinkedIn o YouTube.
- No hay importación CSV en esta fase.
- No hay inferencia estadística, significancia, normalización por periodo ni atribución de ventas.
- El filtro principal es por red; las comparaciones están agrupadas por formato y objetivo.
- La aplicación funciona con datos locales y requiere exportar respaldos para portabilidad.
