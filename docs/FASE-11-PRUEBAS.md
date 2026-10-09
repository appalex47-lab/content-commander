# Fase 11 — Registro de pruebas

## Automatizadas
`node tests/smoke-test.js`

- Suite general: 19/19
- Fase 3: 14/14
- Fase 4: 10/10
- Fase 5: 12/12
- Fase 6: 8/8
- Fase 7: 10/10
- Fase 8: 12/12
- Fase 9: 12/12
- Fase 10: 12/12
- Fase 11: 12/12
- **Total acumulado: 121/121 comprobaciones estáticas**

También se ejecutaron `node --check` sobre `src/analytics.js`, `src/navigation.js` y `tests/smoke-test.js`, sin errores, y se revisó la integridad del ZIP.

## Validaciones manuales pendientes
1. Abrir la app en un navegador real y verificar navegación a Analítica.
2. Registrar métricas con números, guardar, recargar y confirmar persistencia IndexedDB.
3. Dejar una métrica en blanco y verificar que se muestra como “No disponible”, no como cero.
4. Probar valor negativo y decimal; debe mostrar error y no guardar el registro.
5. Crear dos publicaciones del mismo formato y objetivo; comprobar que aparece el promedio y el tamaño de muestra.
6. Cambiar filtro de red y confirmar que resumen, comparaciones y registros se actualizan.
7. Guardar notas de los cuatro tipos, vincular una a una publicación y confirmar persistencia.
8. Exportar un respaldo JSON y confirmar que contiene `analyticsRecords` y `editorialLearnings`.
9. Probar anchuras móviles y navegación con teclado.

No se ha hecho una sesión E2E real de navegador ni se han conectado APIs de redes sociales. Las pruebas estáticas no sustituyen esas validaciones.
