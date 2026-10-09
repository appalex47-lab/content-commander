# Fase 7 — Pruebas y aceptación

## Comprobaciones automatizadas estáticas

Ejecutar desde la raíz del proyecto:

```bash
node --check src/cohere.js
node --check src/forms.js
node --check src/backup.js
node --check src/app.js
node tests/smoke-test.js
```

El conjunto de pruebas revisa las fases anteriores y la presencia de: checklist editorial de seis puntos, aprobación condicionada a completar el checklist, rechazo con motivo obligatorio, alternativa con contexto original, historial de versiones, persistencia de estado, renderizado seguro como texto y estilos responsive.

## Validación manual requerida en navegador

1. Crear un borrador y comprobar que aparece como pendiente.
2. Abrirlo; intentar aprobar con casillas sin marcar y comprobar que no se aprueba.
3. Marcar las seis casillas y aprobar; recargar y comprobar que el estado persiste.
4. Rechazar otro borrador sin motivo y comprobar que se exige; escribir un motivo y registrar el rechazo.
5. Generar alternativa con Cohere conectado; comprobar que conserva red, objetivo, audiencia, tema y pilar, que se crea historial y vuelve a pendiente.
6. Abrir el historial y comprobar legibilidad en escritorio y móvil.
7. Exportar e importar un backup para comprobar que estados e historial se conservan.
8. Verificar que en ningún punto se publica automáticamente.

## Estado de la entrega

Las pruebas de `tests/smoke-test.js` son estáticas. No sustituyen la validación interactiva, la prueba de una API key real ni una revisión especializada de contenido regulado. La prueba de navegador queda pendiente por la limitación del entorno Chromium detectada en fases previas.
