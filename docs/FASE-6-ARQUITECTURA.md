# Fase 6 — Motor de generación de contenido

## Alcance
La fase amplía el generador de borradores existente para que las instrucciones dependan del formato seleccionado y se pueda asociar una pieza a un pilar de la estrategia guardada.

## Formatos soportados
- Publicación para redes: ganchos alternativos, copy, CTA opcional y hashtags pertinentes.
- Carrusel: secuencia de 6–8 diapositivas, texto y sugerencias visuales por diapositiva.
- Reel/video breve: tiempos, gancho, escenas, texto en pantalla, voz y caption.
- Historias: secuencia de 3–5 pantallas e interacciones sugeridas.
- Encuesta: pregunta, opciones y seguimiento, sin inventar resultados.
- Lluvia de ideas: ideas con gancho, pilar sugerido, formato, objetivo y dificultad.
- Guion largo: secciones, tiempos, guion hablado y transiciones.
- Brief para diseñador: jerarquía, copy exacto, dirección visual, accesibilidad y checklist; no genera una imagen final.
- Copy de producto/servicio: solo atributos aportados, sin inventar precio, composición, disponibilidad, resultados o certificaciones.

## Flujo
1. La persona elige formato, red, objetivo, audiencia y tema.
2. El selector de pilar se alimenta de `data.strategy.pillars` y se refresca tras guardar la estrategia.
3. `src/cohere.js` construye el prompt con perfil de empresa, objetivos, KPI, pilares, redes, restricciones y una guía específica del formato.
4. Cohere genera texto mediante la API configurada.
5. El borrador se guarda en `data.contentDrafts` con formato, red, objetivo, audiencia, tema, pilar, modelo, request ID, fecha y estado `pending-human-review`.

## Controles
- El contenido generado es siempre borrador y `approved: false`.
- El prompt prohíbe inventar hechos, testimonios, resultados, especificaciones y credenciales.
- La información incompleta debe señalarse con `[POR VALIDAR]`.
- Los datos escritos por la persona se tratan como entrada y no pueden anular las reglas editoriales.
- No se publican piezas automáticamente.
- El brief para diseñador es texto y no equivale a un diseño final.

## Persistencia y compatibilidad
Se conserva el esquema existente de IndexedDB y el array `data.contentDrafts`. No se cambia la versión de la base de datos ni la versión del backup. Los campos añadidos a cada borrador son opcionales para mantener compatibilidad con borradores anteriores.

## Límites
Las guías de prompt orientan al modelo, pero no garantizan que respete siempre el formato ni que sus afirmaciones sean correctas. La app no consulta fuentes externas, no valida requisitos legales y no confirma la idoneidad de una publicación para una plataforma. Se requiere revisión humana.
