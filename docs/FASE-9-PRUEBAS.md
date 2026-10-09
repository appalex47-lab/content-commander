# Fase 9 — Pruebas

## Automatizadas
Ejecutar `node tests/smoke-test.js`. La suite contiene las comprobaciones históricas de las fases 1–8 y 12 comprobaciones estáticas específicas de la Fase 9.

Las comprobaciones de fase 9 cubren integración en Inicio, indicadores, ventana de siete días, lectura de datos persistidos, distinción entre aprobado y publicado, exclusión de cancelados/publicados de atrasadas, navegación contextual, preparación del perfil, eventos de refresco, responsive, orden de scripts y renderizado seguro.

## Validación manual recomendada en navegador
1. Abrir Inicio con almacenamiento vacío; verificar estado de configuración y ceros, sin error fatal.
2. Crear una pieza con fecha de hoy, una con fecha pasada y otra futura en Calendario; volver a Inicio y verificar que los contadores/lista se actualizan.
3. Cambiar una pieza atrasada a Cancelado y luego a Publicado manualmente; confirmar que deja de contarse como atrasada. La confirmación de publicación debe ser explícita.
4. Crear borradores, aprobar uno y dejar otro pendiente; verificar el contador de revisión y el contador de aprobadas sin publicar.
5. Verificar que la pieza aprobada no se presenta como publicada y que no se realiza ninguna llamada de publicación.
6. Probar ancho móvil y navegación por teclado.
7. Recargar la página y verificar que los indicadores se reconstruyen desde IndexedDB.

## Limitación de ejecución
Las pruebas automatizadas son estáticas y no sustituyen una sesión real de navegador. La suite no hace llamadas reales a Cohere ni a redes sociales.
