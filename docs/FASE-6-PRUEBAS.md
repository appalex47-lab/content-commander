# Fase 6 — Pruebas y aceptación

## Verificaciones automatizadas estáticas
Ejecutar desde la raíz del proyecto:

```bash
node tests/smoke-test.js
node --check src/cohere.js
node --check src/forms.js
node --check src/app.js
```

Las pruebas estáticas verifican que los formatos, las instrucciones específicas, la selección de pilares, los metadatos y la revisión humana estén presentes. No llaman a Cohere.

## Pruebas manuales de navegador pendientes
1. Abrir la aplicación por HTTP, no mediante `file://`.
2. Guardar una estrategia con dos o más pilares que sumen 100%.
3. Abrir Contenidos y confirmar que el selector muestre los pilares y sus porcentajes.
4. Cambiar la estrategia y confirmar que la lista de pilares se actualice.
5. Generar una pieza de cada formato con una API key válida y revisar que la estructura corresponda al tipo seleccionado.
6. Confirmar que cada pieza se guarde con estado pendiente, no aprobada, y que reaparezca tras recargar.
7. Probar errores de red, clave inválida y límite de solicitudes.
8. Confirmar manualmente que no se publique automáticamente.

## Criterio de aceptación
La fase se considera funcional tras pasar pruebas estáticas y completar la validación de navegador/API real. En esta entrega, la validación de navegador y la llamada real a Cohere no se consideran completadas.
