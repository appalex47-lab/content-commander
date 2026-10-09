# Fase 4 — Registro de pruebas

## Pruebas estáticas
Ejecutar `node tests/smoke-test.js`. La suite revisa estructura de vistas, IndexedDB, respaldos, Cohere y nuevos campos del perfil maestro.

## Pruebas funcionales manuales pendientes
1. Abrir en navegador servido por HTTP.
2. Guardar nombre y oferta dejando los demás campos vacíos; comprobar que guarda y muestra base mínima cubierta.
3. Completar misión, valores, tono y restricciones; guardar, recargar y confirmar restauración.
4. Exportar JSON, comprobar que `data.company` incluye los nuevos campos y reimportarlo en un perfil de prueba.
5. Generar un borrador con Cohere y comprobar que usa los campos; esta prueba requiere una API key válida y conectividad.
6. Probar móvil y navegación con teclado/lector de pantalla.

## Límites
Las pruebas estáticas no simulan IndexedDB real ni llamadas a Cohere. No se afirma validación completa de navegador hasta ejecutar los pasos manuales.
