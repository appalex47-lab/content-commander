# Fase 15 — Pruebas

## Comprobaciones estáticas automatizadas
La suite `tests/smoke-test.js` incluye 14 verificaciones nuevas para:
- Rellenado estructurado de estrategia y confirmación antes de reemplazar.
- Validación de pilares y guardado manual.
- Ideación y traslado de ideas al formulario de contenido.
- Plan editorial de 12 semanas con ritmo 2/3 por semana.
- Validación del plan, vista previa, acción explícita de guardado y preservación del calendario existente.
- Carga de scripts y renderizado seguro.
- Estado `planned` y ausencia de publicación automática.

## Validación pendiente
Estas comprobaciones no sustituyen una prueba E2E real. Deben probarse en navegador con clave Cohere válida:
1. Estrategia: generar, verificar controles y pilares, guardar y recargar para confirmar persistencia.
2. Ideas: generar lista, elegir una, verificar que todos los controles del formulario se rellenan correctamente y generar un borrador.
3. Calendario: generar 24 piezas, revisar fechas y pilares, añadirlas, navegar meses y recargar.
4. Probar salida truncada/mal formada y confirmar que no se modifica el estado guardado.
5. Probar modelo configurado y errores HTTP de Cohere.
