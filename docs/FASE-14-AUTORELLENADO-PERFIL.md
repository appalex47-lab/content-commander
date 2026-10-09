# Fase 14 — Autorrelleno asistido del perfil de empresa

## Objetivo
Eliminar el flujo de copiar y pegar para completar el perfil maestro con ayuda de Cohere.

## Comportamiento
- El botón «Ayúdame a completar mi perfil» pide a Cohere una respuesta JSON con claves alineadas a los campos del formulario.
- La respuesta se analiza y se coloca directamente en los campos vacíos del perfil.
- Los valores que ya estaban escritos se preservan para evitar sobrescribir información aportada por la persona.
- El nombre de la empresa y la oferta no se inventan; si faltan, la persona debe completarlos.
- Los campos propuestos por la IA son borradores. La respuesta debe marcar incertidumbres con `[POR VALIDAR]` y proponer preguntas cuando falten hechos.
- Los campos se rellenan en el formulario pero NO se guardan automáticamente. La persona revisa y pulsa «Guardar perfil maestro».
- Se muestra un resumen de cuántos campos se rellenaron y cuántos se preservaron.
- Las respuestas mal formadas muestran un error comprensible y no se aplican.

## Archivos
- `src/assistant.js`: prompt JSON, parser, asignación segura de campos y estado de interfaz.
- `tests/smoke-test.js`: checks estáticos de la ruta de autorrelleno.

## Validación
Las comprobaciones de esta fase verifican el código y los contratos estáticos. No sustituyen una llamada real a Cohere ni una prueba E2E en navegador. La prueba manual debe comprobar que un perfil parcial rellena campos vacíos, preserva los campos existentes y deja guardar solo tras revisión humana.
