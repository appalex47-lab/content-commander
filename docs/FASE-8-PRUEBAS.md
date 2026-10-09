# Fase 8 — Pruebas y criterios de aceptación

## Checks estáticos automatizados
Ejecutar `node tests/smoke-test.js`. El bloque de Fase 8 comprueba:
1. Formulario y filtros mensual/estado.
2. Persistencia en `data.editorialPlan` y compatibilidad con backup.
3. Campos esenciales de planificación.
4. Vinculación exclusiva de borradores aprobados.
5. Estado inicial `planned`.
6. Confirmación manual para marcar publicación y marca de tiempo.
7. Ausencia de integración de publicación.
8. Distribución de pilares descriptiva.
9. Renderizado sin `innerHTML`.
10. Actualización tras cambios de estrategia/aprobación.
11. Estilos adaptables a móvil.
12. Orden de carga de módulos.

## Validación manual pendiente
- Abrir la app en un navegador real, guardar una pieza, recargar y verificar persistencia.
- Crear/guardar pilares en Estrategia y comprobar distribución mensual.
- Aprobar un borrador, volver a Calendario y vincularlo.
- Cambiar estado a Publicado y confirmar; cancelar el diálogo y comprobar que el estado no cambió.
- Exportar e importar un respaldo para verificar que `editorialPlan` se conserva.
- Probar vista móvil y accesibilidad con teclado/lector de pantalla.

Los checks estáticos no equivalen a pruebas end-to-end ni a una conexión real con plataformas externas.
