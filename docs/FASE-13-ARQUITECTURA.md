# Fase 13 — Corrección de Cohere y asistente de estrategia

## Motivo
La persona usuaria reportó el error “Cohere respondió pero no devolvió texto” y señaló que el producto no la acompaña suficientemente para descubrir/definir información que desconoce.

## Cambios
- `src/cohere.js`: extracción de texto más tolerante a las formas habituales de `message.content` en Chat API v2 (array de bloques, cadena u objeto), y compatibilidad de respaldo con `data.text`.
- Si no hay texto, el error ahora informa `finish_reason` y tipos de bloques presentes, en lugar de atribuir genéricamente el problema al modelo.
- La prueba de conexión solicita texto final, evita pedir JSON/herramientas y sube el presupuesto de salida a 100 tokens.
- `src/assistant.js`: nuevo asistente pedagógico para el perfil de empresa y otro para estrategia.
- Perfil: propone versiones provisionales de propuesta de valor, hipótesis de diferenciadores y evidencia requerida, candidatos de audiencia, preguntas prioritarias y mapa de campos.
- Estrategia: propone objetivo, KPI y línea base necesaria, 3–5 pilares que suman 100%, hasta dos redes con razonamiento hipotético y un experimento inicial de 30 días.
- Las propuestas se presentan como texto seleccionable/copible. No se guardan ni aplican automáticamente; la persona conserva el control y debe validar las hipótesis.
- `index.html` integra los dos puntos de entrada y carga el módulo en orden correcto; `styles.css` agrega estilos responsive.

## Límites y seguridad
- No se pudo comprobar una llamada real a Cohere porque no tenemos acceso a la clave del usuario ni a su sesión de navegador. Las pruebas no simulan una llamada real.
- El parser robusto reduce errores de interpretación de la respuesta, pero no garantiza que cualquier modelo, permiso de cuenta o clave funcione.
- La clave permanece en localStorage como en el diseño existente; la app estática no puede mantenerla secreta.
- La IA no valida hechos, mercado, audiencias ni desempeño de redes por sí sola. Toda recomendación estratégica es una hipótesis hasta que se contraste.
