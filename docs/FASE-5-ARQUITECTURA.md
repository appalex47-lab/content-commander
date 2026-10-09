# Fase 5 — Estrategia y pilares de comunicación

## Objetivo
Convertir el formulario estratégico inicial en una configuración reutilizable que conecte objetivo de negocio, objetivo de comunicación, audiencia, KPI, pilares editoriales y elección razonada de canales.

## Persistencia y contrato
Los datos se guardan en el objeto `data.strategy` del registro principal de IndexedDB. Se mantienen los campos heredados `goal`, `horizon` y `audience`, y se agregan:

- `communicationGoal`: efecto buscado en la audiencia.
- `kpi`: indicador principal propuesto por la persona.
- `target`: meta y/o punto de partida, si existe.
- `pillars`: lista de `{ name, description, percentage }`.
- `primaryNetwork`, `secondaryNetwork`: selección declarada por el usuario.
- `networkRationale`: justificación y nivel de evidencia declarado.
- `resources`: tiempo, equipo, presupuesto y límites operativos.
- `strategySaved` y `strategyUpdatedAt` permanecen en el objeto raíz como metadatos históricos.

No se cambia el número de versión de IndexedDB ni el esquema del backup: se amplía un objeto existente y los respaldos anteriores siguen siendo compatibles.

## Validaciones
- Objetivo de negocio, objetivo de comunicación y audiencia son obligatorios.
- Debe existir al menos un pilar.
- Cada pilar requiere nombre único, porcentaje numérico entre 0 y 100 y descripción opcional.
- La suma debe ser exactamente 100 antes de guardar.
- Los valores se validan en el cliente y se muestran mensajes accesibles en el formulario.
- Las redes no se declaran “óptimas” automáticamente. La persona documenta la justificación y debe contrastarla con datos reales.

## Integración con Cohere
El prompt de generación de contenido incorpora los objetivos, KPI/meta, pilares y distribución, redes elegidas, justificación y recursos disponibles. Si faltan datos, Cohere recibe la instrucción de no inventarlos.

## Límites
La elección de redes sigue siendo manual; no hay investigación de audiencia, datos de rendimiento ni recomendación automática basada en fuentes verificadas. No hay publicación automática. La distribución 100% representa proporción de contenido planificado, no garantía de resultados.
