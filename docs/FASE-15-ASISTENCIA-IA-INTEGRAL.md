# Fase 15 — Asistencia de IA a lo largo del flujo

## Objetivo
Pasar de asistentes que entregan texto para copiar a asistentes que llevan la propuesta a los campos de trabajo de Estrategia, ayudan a elegir ideas de contenido y generan una propuesta de calendario editorial de 12 semanas.

## Estrategia
- `Proponer mi estrategia con IA` pide JSON estructurado y llena los controles existentes: prioridad de negocio, horizonte, objetivo de comunicación, KPI, meta/línea base, audiencia, pilares, redes, justificación y recursos.
- Antes de sustituir los campos existentes, requiere confirmación explícita.
- Comprueba que existan entre 3 y 5 pilares y que sus porcentajes sumen exactamente 100 antes de aplicar la propuesta.
- No guarda la estrategia automáticamente. La persona revisa y utiliza el botón existente `Validar y guardar estrategia`.

## Contenidos
- Nuevo bloque `Proponer ideas de contenido` genera diez ideas con tema, formato, red, pilar, objetivo, audiencia, gancho, CTA y explicación.
- `Usar esta idea para crear contenido` traslada la selección al formulario actual. La persona puede editar y generar un borrador con Cohere.
- No se crean borradores completos ni se aprueban automáticamente desde la lista de ideas.

## Calendario
- Nuevo asistente propone aproximadamente 12 semanas con ritmo seleccionable de dos o tres piezas por semana.
- Requiere oferta/perfil de empresa y una estrategia guardada con pilares para evitar un calendario genérico.
- Valida fechas, periodo, formato, red y nombre de pilar antes de mostrar la vista previa.
- La persona debe pulsar `Añadir N piezas al calendario` para guardar. Las piezas se agregan a las existentes, no las reemplazan.
- Todas las piezas quedan como `planned`, con `needsHumanReview: true`; no se publica en redes.

## Seguridad y honestidad
- Respuestas estructuradas parseadas como JSON; contenido visible insertado mediante `textContent`.
- Las recomendaciones siguen siendo hipótesis cuando no hay evidencia.
- La clave Cohere permanece en la configuración local, fuera del respaldo JSON.

## Limitaciones conocidas
- La salida JSON puede ser incompleta o mal formada según modelo/límite de tokens; se informa del error y se evita aplicar datos inválidos.
- Un calendario de 36 piezas puede exceder la salida disponible en ciertos modelos. En ese caso, el usuario puede reintentar con dos piezas por semana; el plan no se guarda si no supera la validación mínima.
- La calidad y disponibilidad de cada idea no se pueden certificar mediante pruebas estáticas. Se requiere probar con Cohere real y revisar el contenido propuesto.
- No hay publicación automática, analítica de plataformas ni verificación de hechos externa.
