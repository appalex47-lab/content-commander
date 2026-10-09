# Fase 5 — Pruebas

## Pruebas ejecutadas
- `node --check` sobre los módulos JavaScript.
- Suite de pruebas estáticas acumulada de fases 1–5.
- Verificación estructural del formulario, validación de porcentajes, nombres únicos, restauración de datos y contexto transmitido al prompt de Cohere.
- Integridad del ZIP con `unzip -t`.

## Limitaciones
Estas comprobaciones no sustituyen una prueba interactiva en Chromium/Firefox ni una llamada real a Cohere. En esta ejecución no se pudo completar una sesión real de navegador; la interacción, persistencia real en IndexedDB y CORS deben confirmarse al abrir la app desde un servidor HTTP o GitHub Pages.

## Escenarios manuales de aceptación
1. Agregar 3 pilares con 50/30/20: debe impedir guardar y explicar que falta 100%.
2. Ajustar a 40/30/30: debe permitir guardar si los nombres son únicos y los objetivos obligatorios están completos.
3. Introducir dos pilares con el mismo nombre: debe impedir guardar.
4. Poner -1, 101 o un campo vacío: debe impedir guardar.
5. Recargar y verificar restauración de todos los campos y pilares.
6. Generar un borrador con Cohere y comprobar que el prompt incluye los pilares y objetivos definidos.
7. Verificar que los datos previos de empresa y borradores siguen intactos.
