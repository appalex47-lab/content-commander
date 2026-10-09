# Fase 12 — Auditoría integral y preparación del release

## Alcance
Auditoría final de integración de las fases 0–11. Esta fase no agrega funcionalidades editoriales nuevas; corrige defectos de seguridad/integridad detectados y deja instrucciones reproducibles para publicar el sitio estático.

## Arquitectura auditada
- HTML/CSS/JavaScript vanilla, sin proceso de compilación.
- `src/storage.js` es la capa de persistencia: IndexedDB `estudio-content-commander`, almacén `workspace`, registro `primary`.
- Los módulos funcionales cargan antes de `src/app.js`; la navegación comunica cambios de vista mediante eventos personalizados.
- Cohere se invoca directamente desde el navegador. La clave vive en `localStorage`, fuera de IndexedDB y de los respaldos; esto es una limitación de seguridad aceptada del despliegue estático.
- Los datos no se sincronizan entre dispositivos ni se envían automáticamente a redes sociales.

## Hallazgo corregido
**Importación de respaldos sin validar `schemaVersion`.** La validación comprobaba la versión del contenedor (`backupVersion`) pero no exigía que el esquema de datos correspondiera a la versión de la aplicación. Un JSON con esquema incompatible podía pasar a la importación y dejar campos no compatibles en el espacio de trabajo.

**Corrección:** `validateBackup()` ahora exige `app === "Content Commander"`, `backupVersion === BACKUP_VERSION`, `schemaVersion === DB_VERSION` y un objeto `data` no-array. Los respaldos de esquema incompatible se rechazan antes de habilitar la importación. Se agregó una regresión al test funcional de IndexedDB.

## Verificaciones realizadas
- Sintaxis JavaScript de todos los módulos y pruebas (`node --check`).
- Suite de comprobaciones estáticas de fases 0–12.
- IDs HTML duplicados y referencias a scripts locales.
- Presencia de vistas para rutas de navegación.
- Revisión estática de inserción de contenido de usuario (sin asignaciones `innerHTML` en los módulos auditados).
- Enlaces de investigación abiertos en pestaña nueva con `noopener noreferrer`.
- Intento de prueba funcional en Chromium headless: el proceso no terminó dentro del límite; queda pendiente la validación interactiva normal. Detalles en `FASE-12-PRUEBAS.md`.
- Integridad del ZIP final.

## Limitaciones que permanecen
1. La clave de Cohere en `localStorage` puede ser leída por código JavaScript del mismo origen; no es adecuada para una app pública multiusuario con secretos sensibles.
2. No se validó una llamada real a Cohere ni el comportamiento de CORS/red en producción.
3. No hay sincronización en nube, conexión automática a redes sociales, publicación programada ni importación CSV de analítica.
4. Los tests estáticos no sustituyen pruebas manuales de usabilidad con datos reales y móvil.
5. GitHub Pages no ejecuta backend. La app necesita servirse por HTTP/HTTPS; abrir `index.html` como `file://` puede bloquear IndexedDB o peticiones.
6. No se declara publicado en GitHub: el ZIP es un artefacto de release local. La publicación requiere que la persona usuaria lo suba al repositorio y configure Pages.

## Criterios de aceptación del release
- [x] Los módulos JavaScript pasan análisis de sintaxis.
- [x] Suite estática completa sin fallos.
- [x] No hay IDs HTML duplicados.
- [x] Todas las referencias locales a scripts existen.
- [x] La validación de respaldos rechaza esquemas incompatibles.
- [x] Instrucciones de despliegue documentadas.
- [x] ZIP generado y comprobado con `unzip -t`.
- [ ] Llamada real a Cohere comprobada con una clave del usuario.
- [ ] Publicación verificada en GitHub Pages por la persona usuaria.
