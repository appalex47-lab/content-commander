# Content Commander

Aplicación estática en español para aprender y gestionar estrategia y contenido de redes sociales. La aprobación editorial es humana; la app no publica automáticamente.

## Estado
- Fases 0–3: prototipo, arquitectura, IndexedDB/backups y conexión directa configurable con Cohere.
- Fase 4: perfil maestro de empresa con misión, visión, valores, propuesta de valor, diferenciadores, audiencia, tono, personalidad, evidencia y restricciones.
- Persistencia local con IndexedDB; respaldos JSON versionados.
- Investigación web/tendencias, pilares estratégicos completos y publicación automática no disponibles aún.

## Ejecutar
Desde esta carpeta: `python -m http.server 8000`; abrir `http://localhost:8000`. Para pruebas estáticas: `node tests/smoke-test.js`.

## Seguridad
No guardar API keys en el repositorio. La clave de Cohere se almacena en localStorage del navegador y no se incluye en respaldos, pero no es segura frente a scripts del mismo origen. Para una aplicación pública, considerar backend/proxy seguro.

Ver `docs/FASE-4-ARQUITECTURA.md` y `docs/FASE-4-PRUEBAS.md`.
