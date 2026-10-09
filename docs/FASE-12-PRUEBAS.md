# Fase 12 — Registro de pruebas

## Pruebas estáticas
Se ejecutó `node --check` sobre todos los archivos `src/*.js` y `tests/*.js` y `node tests/smoke-test.js`.

Resultado de la suite final: **131/131 comprobaciones estáticas aprobadas** (19 generales, fases 3–11 y 10 de auditoría Fase 12).. Las comprobaciones estáticas inspeccionan contratos y estructura; no todas ejecutan interacciones reales de UI.

## Regresión de respaldos
`src/storage.js` ahora rechaza el respaldo si `schemaVersion` no coincide con `DB_VERSION`, además de comprobar aplicación, versión del contenedor y tipo del objeto de datos. `tests/browser-storage-test.html` incluye un caso de esquema incompatible.

## Prueba de navegador
El test funcional puede ejecutarse en un navegador Chromium con el servidor HTTP local:

1. Desde la raíz del proyecto: `python -m http.server 8000`.
2. Abrir `http://localhost:8000/tests/browser-storage-test.html`.
3. Esperar el resultado final y comprobar que todas las filas digan `PASS`.
4. Para repetir desde cero, limpiar los datos del sitio en el navegador; el test reemplaza el registro `primary` de la base local.

Se intentó ejecutar la prueba en Chromium headless desde un servidor HTTP local, pero el proceso no terminó dentro del límite de ejecución y no produjo un resultado verificable. Por rigor, la prueba funcional de IndexedDB se considera **pendiente**, no aprobada; ejecutar manualmente los pasos anteriores en un navegador normal.

## Revisión de estructura
- IDs HTML: sin duplicados.
- Scripts locales: todas las referencias resolvieron a archivos existentes.
- Rutas de navegación: todas apuntan a una vista existente.
- Contenido de usuario: no se encontraron asignaciones `innerHTML` en los módulos auditados.
- Enlaces externos de investigación: `noopener noreferrer` presente en enlaces con `target="_blank"`.

## No cubierto
No se probó una llamada autenticada a Cohere, no se probó despliegue productivo, y no se probaron todos los flujos manualmente en varios navegadores/dispositivos. Esos límites deben permanecer visibles en cualquier declaración de calidad.
