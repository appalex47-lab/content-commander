# Fase 3 — Integración de Cohere

## Alcance
- Ajustes para introducir/guardar/eliminar una API key y seleccionar un modelo.
- Llamada directa a Cohere Chat API v2 desde el navegador.
- Prueba real de conexión iniciada por el usuario.
- Formulario de generación de borradores para publicación, carrusel, reel/video, historias, encuesta o ideas.
- Contexto desde el perfil de empresa y la estrategia guardados.
- Guardado local de borradores en IndexedDB, estado `pending-human-review`, `approved: false`.
- Mensajes de error diferenciados para autenticación, permisos, límite de uso, solicitud inválida, servidor, red/CORS y timeout.

## Contrato de API
- Endpoint: `POST https://api.cohere.com/v2/chat`
- Cabeceras: `Authorization: Bearer <API_KEY>`, `Content-Type: application/json`, `X-Client-Name: Content Commander`.
- Cuerpo: `model`, `messages`, `max_tokens`, `temperature`.
- La respuesta se lee de `message.content[].text`.
- Modelos seleccionables: `command-a-plus-05-2026`, `command-a-reasoning-08-2025`, `command-a-03-2025`, `command-r7b-12-2024`.

## Gestión de la clave
- Se guarda en `localStorage` bajo `content-commander-cohere-config-v1`, separada de IndexedDB.
- No se precarga la clave en el campo de contraseña; el usuario puede introducir una nueva para reemplazarla.
- La exportación de respaldos opera sobre los datos de IndexedDB y no incluye la configuración local de Cohere.
- La clave puede ser inspeccionada por JavaScript del mismo origen y por extensiones del navegador. Esto es una concesión explícita para el despliegue estático, no almacenamiento seguro. No subir claves al repositorio ni incluirlas en capturas o archivos compartidos.

## Límites
- La llamada depende de internet y de que la API sea accesible desde el navegador. Si el navegador/proveedor bloquea la solicitud por CORS o red, se informa del error; no se usa una respuesta simulada.
- La integración no incluye búsqueda web, navegación, verificación de fuentes ni análisis de tendencias actuales.
- La IA puede generar afirmaciones erróneas. El prompt exige marcar información faltante como `[POR VALIDAR]`, pero esto no sustituye la revisión de una persona.
- Los borradores no se publican ni se aprueban automáticamente.
- No se usa un backend propio ni se añade una dependencia de SDK.

## Archivos
- `src/cohere.js`: configuración, cliente HTTP, generación y lista de borradores.
- `index.html`: formularios de configuración y generación.
- `styles.css`: presentación de borradores y estados.
- `tests/smoke-test.js`: pruebas estáticas acumuladas de fases 1–3.
