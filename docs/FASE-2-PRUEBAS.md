# Fase 2 — Registro de pruebas

## Pruebas automatizadas incluidas

Ejecutar desde la carpeta del proyecto:

```bash
node tests/smoke-test.js
for f in src/*.js tests/*.js; do node --check "$f" || exit 1; done
```

La batería cubre estructura y vistas, IndexedDB, migración legacy, esquema versionado, validación de respaldo, exclusión de claves API al importar, reemplazo/combinación, vista previa, límite de archivo, descarga JSON, accesibilidad básica, progreso y orden de scripts.

## Límites de esta ejecución

Las pruebas estáticas no ejecutan IndexedDB dentro de un navegador. Se requiere validación manual de navegador antes de release: migración con datos legacy reales, recarga, exportación, importación válida e inválida, cancelación de confirmación, modo reemplazo/combinación, falta de espacio y navegación en móvil.
