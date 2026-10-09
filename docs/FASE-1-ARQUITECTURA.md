# Fase 1 — Arquitectura y fundamentos técnicos

## Objetivo
Separar responsabilidades del prototipo, fijar contratos iniciales y preparar la aplicación estática para crecer sin introducir un backend propio.

## Arquitectura actual
- `index.html`: estructura semántica y vistas.
- `styles.css`: diseño visual, responsive, estados y foco.
- `src/navigation.js`: navegación de vistas y menú móvil.
- `src/forms.js`: formularios de empresa y estrategia.
- `src/learning.js`: ejercicio, evaluación y estado pedagógico.
- `src/storage.js`: límite de acceso a persistencia local.
- `src/app.js`: inicialización y restauración.
- `tests/smoke-test.js`: pruebas automatizadas estáticas.
- `docs/`: decisiones, contratos y pruebas.

## Decisiones
1. Sin backend propio; compatible con hosting estático/GitHub Pages.
2. JavaScript nativo, sin dependencias ni compilación obligatoria.
3. Separación por responsabilidades; comunicación entre módulos mediante `window.AppStorage`, `window.AppNavigation`, `window.AppLearning` y `window.AppForms`.
4. La persistencia sigue en localStorage solo temporalmente; la abstracción permite migrar a IndexedDB en Fase 2.
5. No se almacenan claves API ni se simula una conexión real con Cohere.
6. El contenido no aprobado por una persona no se considerará listo para publicar.
7. Los datos desconocidos deben permanecer pendientes, no rellenarse por inferencia.

## Contrato de datos provisional (schemaVersion 1)
- `company`: `{ company, sector, offer, difference }`
- `strategy`: `{ goal, horizon, audience }`
- `brief`: `{ brief-company, brief-offer, brief-audience, brief-problem, brief-goal, brief-horizon, brief-evidence }`
- `learning`: `{ quizPassed, briefSaved, lessonReviewed }`
- `profileSaved`: boolean
- `strategySaved`: boolean
- `updatedAt`: timestamp ISO generado al escribir.
- `schemaVersion`: versión del sobre de almacenamiento.

Este contrato es transitorio; Fase 2 deberá normalizar IDs, crear stores de IndexedDB y migración sin pérdida desde el esquema provisional.

## Flujo de inicialización
1. Leer datos locales con protección ante JSON inválido o almacenamiento bloqueado.
2. Restaurar perfil, estrategia, brief y progreso.
3. Conectar eventos de navegación, formularios y evaluación.
4. Guardar con comprobación de errores y estado visible.

## Restricciones y riesgos
- localStorage no es una copia de seguridad, depende del navegador/origen y puede borrarse.
- Las API keys de Cohere no deben incluirse en el repositorio.
- La búsqueda web desde frontend estático requiere un proveedor compatible y una revisión de CORS/credenciales.
- GitHub Pages no ejecuta Python ni un backend propio.
- La compatibilidad con file:// puede variar entre navegadores; preferir servidor estático local para pruebas.

## Deuda técnica para siguientes fases
- Fase 2: IndexedDB, migraciones, exportación/importación versionada, validación de archivos y recuperación.
- Fase 3: cliente Cohere configurable, manejo de errores/cuotas y minimización de datos enviados.
- Fase 10: elegir proveedor de búsqueda compatible y documentar límites.
- Fase 12: auditoría integral, pruebas reales de navegador y release.
