# Fase 10 — Tendencias e investigación

## Alcance implementado
- Nueva vista de investigación enlazada en navegación.
- Preparación de búsquedas externas Google, Google News y Bing a partir de la pregunta del usuario. La persona abre resultados, evalúa fuentes y registra título, URL, fecha y notas.
- Síntesis opcional mediante la configuración Cohere ya existente. El prompt exige separar evidencia aportada, interpretación, hipótesis, vacíos y ángulos editoriales.
- Biblioteca persistente en `data.researchLibrary` dentro de IndexedDB, incluida automáticamente en respaldos versionados existentes. Se puede guardar una investigación aunque todavía no se haya generado síntesis.
- Reapertura y eliminación de investigaciones guardadas.

## Modelo de datos
Cada registro incluye `id`, `topic`, `audience`, `goal`, `pillar`, `sources[]`, `report`, `model`, `createdAt` y `updatedAt`. Cada fuente contiene `title`, `url`, `date`, `notes` y `savedAt`.

## Seguridad y límites
- La app no hace scraping ni descarga automáticamente el contenido de los enlaces.
- Cohere recibe la pregunta y las notas de fuentes que el usuario guardó, no el contenido completo de las páginas salvo que el usuario lo copie/resuma en notas.
- Se aceptan únicamente URLs HTTP/HTTPS para enlaces de fuente. Se usa `textContent` para mostrar entradas del usuario.
- La IA no verifica la existencia, actualidad, autoridad ni exactitud de las fuentes; la persona debe abrirlas y contrastarlas.
- Esta fase no afirma que una idea sea tendencia solo porque aparezca en una fuente.
- No se modifica el esquema de IndexedDB: se agrega un campo dentro del objeto de datos existente.
