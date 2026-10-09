# Fase 10 — Pruebas

Las comprobaciones automatizadas estáticas se ejecutan con `node tests/smoke-test.js`. La suite incluye 12 aserciones para la fase 10 además de las suites acumuladas.

Validaciones de fase: navegación; búsqueda externa explícita; campos requeridos de fuente; rechazo de esquemas URL inseguros; instrucciones de separación de evidencia/interpretación/hipótesis; transparencia sobre enlaces no verificados; persistencia en IndexedDB; reapertura y eliminación; actualización de pilares; renderizado seguro; orden de carga; responsive CSS.

## Pruebas manuales pendientes
1. Abrir la vista en navegador de escritorio y móvil.
2. Confirmar que el navegador permite abrir las búsquedas externas.
3. Guardar fuentes con URL HTTP/HTTPS válidas e inválidas.
4. Probar síntesis con una API key válida de Cohere y observar errores de red/CORS/autorización.
5. Guardar, recargar, reabrir y borrar una investigación.
6. Exportar e importar un respaldo y comprobar que `researchLibrary` se conserva.

Las pruebas estáticas no equivalen a una validación end-to-end. No se afirma que se haya realizado una llamada real a Cohere ni que las fuentes se hayan verificado automáticamente.
