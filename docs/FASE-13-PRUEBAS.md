# Fase 13 — Pruebas

## Pruebas ejecutadas
- `node --check src/cohere.js` — aprobado.
- `node --check src/assistant.js` — aprobado.
- `node --check src/forms.js` — aprobado.
- `node tests/smoke-test.js` — suites históricas aprobadas; se agregaron 10 comprobaciones estáticas para la fase 13.
- Revisión manual del parser: contempla `message.content` como array, string u objeto; ignora bloques no textuales y da un error más informativo cuando no existe texto final.

## No ejecutado / pendiente
- No se realizó petición autenticada real a Cohere: no hay clave disponible para el entorno de pruebas.
- No se pudo probar el flujo de los botones de asistencia en un navegador real.
- No se comprobó la app desplegada en GitHub Pages.

## Prueba manual recomendada
1. Abrir Ajustes e introducir una clave Cohere vigente; seleccionar `Command A Plus`.
2. Guardar y pulsar “Probar conexión”. Debe mostrar una respuesta breve real. Si falla, copiar el mensaje completo (sin compartir la clave).
3. Ir a Mi empresa y pulsar “Ayúdame a completar mi perfil”. Verificar que presenta propuestas y preguntas sin rellenar ni guardar los campos automáticamente.
4. Ir a Estrategia y pulsar “Proponer mi estrategia con IA”. Verificar que propone KPI, pilares que suman 100% y redes con razones y supuestos.
5. Revisar y copiar solo las propuestas que correspondan a datos confirmados; guardar manualmente los campos después de validarlos.
