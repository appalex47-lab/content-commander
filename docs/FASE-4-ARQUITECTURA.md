# Fase 4 — Perfil maestro de empresa

## Objetivo
Crear una fuente de contexto empresarial editable, explícita y persistente que ayude a orientar la estrategia y las solicitudes a Cohere sin inventar información.

## Datos guardados
El objeto `company` contiene `company`, `sector`, `offer`, `mission`, `vision`, `values`, `valueProposition`, `difference`, `audience`, `tone`, `personality`, `evidence`, `restrictions` y `notes`. Se guarda en el workspace de IndexedDB mediante `AppStorage.write`; se conserva en los respaldos existentes como parte de `data.company`.

## Validación y UX
Solo el nombre de la empresa y la descripción de la oferta son obligatorios para guardar. El resto puede quedar vacío y se presenta como información pendiente. Un indicador muestra cuántos de 13 campos clave están completados; no es una certificación de veracidad.

## Uso por Cohere
`src/cohere.js` incluye misión, visión, valores, propuesta de valor, diferenciadores, audiencia, tono, personalidad, evidencia y restricciones en el contexto del prompt. Se mantienen las instrucciones de no inventar hechos y marcar datos ausentes con `[POR VALIDAR]`. El prompt no equivale a verificación independiente.

## Compatibilidad
Se reutiliza la estructura `data.company` existente, por lo que no requiere cambio del esquema de IndexedDB ni de la versión del backup. Los campos que no existan en backups antiguos quedan vacíos.

## Fuera de alcance
Pilares y distribución porcentual, selección de redes, investigación web, validación regulatoria automática, colaboración multiusuario y backend seguro. Se planifican en fases posteriores.
