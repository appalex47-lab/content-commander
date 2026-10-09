# Content Commander

Aplicación estática en español para aprender y gestionar estrategia y contenido de redes sociales. La aprobación editorial es humana; la app no publica automáticamente.

## Estado
- Fases 0–3: prototipo, arquitectura, IndexedDB/backups y conexión directa configurable con Cohere.
- Fase 4: perfil maestro de empresa con misión, visión, valores, propuesta de valor, diferenciadores, audiencia, tono, personalidad, evidencia y restricciones.
- Fase 5: objetivos de negocio/comunicación, KPI, pilares con porcentajes que suman 100%, elección razonada de redes y contexto estratégico incorporado al prompt de Cohere.
- Persistencia local con IndexedDB; respaldos JSON versionados.
- Investigación web/tendencias y publicación automática no disponibles aún. La selección de redes se documenta manualmente y no se presenta como una recomendación basada en datos externos.

## Ejecutar
Desde esta carpeta: `python -m http.server 8000`; abrir `http://localhost:8000`. Para pruebas estáticas: `node tests/smoke-test.js`.

## Seguridad
No guardar API keys en el repositorio. La clave de Cohere se almacena en localStorage del navegador y no se incluye en respaldos, pero no es segura frente a scripts del mismo origen. Para una aplicación pública, considerar backend/proxy seguro.

Ver `docs/FASE-4-ARQUITECTURA.md`, `docs/FASE-4-PRUEBAS.md`, `docs/FASE-5-ARQUITECTURA.md` y `docs/FASE-5-PRUEBAS.md`.
- Fase 6: motor de generación con instrucciones específicas para publicaciones, carruseles, reels, historias, encuestas, ideas, guiones largos, briefs para diseño y copy de producto/servicio; permite vincular cada borrador a un pilar estratégico.

Ver `docs/FASE-6-ARQUITECTURA.md` y `docs/FASE-6-PRUEBAS.md`.

## Fase 7 — Revisión editorial y aprobación humana

Los borradores ahora admiten una lista de comprobación editorial, aprobación humana explícita, rechazo con motivo y generación de alternativas con historial de versiones. La aprobación no publica contenido. Consulta `docs/FASE-7-ARQUITECTURA.md` y `docs/FASE-7-PRUEBAS.md` para el modelo de datos, las reglas y las pruebas manuales pendientes.

## Fase 8 — Plan mensual y calendario editorial

El calendario permite crear y mantener publicaciones planificadas por fecha/hora, red, formato, pilar, objetivo y responsable; vincular un borrador aprobado; filtrar por mes/estado; y consultar una distribución orientativa de piezas por pilar. Los cambios se guardan en IndexedDB bajo `data.editorialPlan` y se incluyen en respaldos JSON. La aplicación no publica ni programa contenido en redes. El estado “Publicado manualmente” requiere confirmación de una persona.

- Arquitectura: `docs/FASE-8-ARQUITECTURA.md`
- Pruebas: `docs/FASE-8-PRUEBAS.md`
- Ejecutar checks estáticos: `node tests/smoke-test.js`

## Fase 9 — Dashboard y seguimiento diario
La pantalla Inicio incorpora un panel operativo con piezas para hoy, piezas atrasadas según fecha/estado, borradores pendientes de revisión, piezas aprobadas que aún no constan como publicadas y próximos elementos de los siete días siguientes. Incluye prioridades accionables y recomendaciones de configuración. Los datos se leen de IndexedDB; el panel no publica contenido ni inventa métricas de rendimiento. Consulta `docs/FASE-9-ARQUITECTURA.md` y `docs/FASE-9-PRUEBAS.md`.


## Fase 10 — Tendencias e investigación
Incluye registro de fuentes, búsquedas externas iniciadas por la persona usuaria y síntesis asistida por Cohere a partir de notas aportadas. No rastrea ni verifica automáticamente la web. Consulta `docs/FASE-10-ARQUITECTURA.md` y `docs/FASE-10-PRUEBAS.md`.

## Fase 11 — Analítica y aprendizaje editorial
La aplicación permite registrar manualmente métricas de publicaciones (alcance, impresiones, interacciones, clics y conversiones), revisar promedios descriptivos por métrica y guardar observaciones, hipótesis, experimentos y decisiones editoriales. Los campos sin dato permanecen como “No disponible”; los promedios no demuestran causalidad. No hay conexión automática con redes sociales ni importación de métricas en esta fase. Consulta `docs/FASE-11-ARQUITECTURA.md` y `docs/FASE-11-PRUEBAS.md`.

## Fase 12 — Auditoría y publicación
Se añadió validación estricta de la versión de esquema en la importación de respaldos, documentación de auditoría y guía de despliegue. Consulta `docs/FASE-12-AUDITORIA.md` y `docs/FASE-12-PRUEBAS.md`.

### Publicar en GitHub Pages
1. Descomprime el ZIP de release en tu computadora.
2. En el repositorio `appalex47-lab/content-commander`, sube el contenido de la carpeta del proyecto a la raíz de la rama `main` (debe quedar `index.html` en la raíz, no dentro de una carpeta anidada).
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**; selecciona `main` y la carpeta `/(root)`, y guarda.
5. Espera a que termine la publicación y abre la URL que GitHub Pages muestre en esa pantalla.
6. Prueba la navegación, crea datos de prueba, recarga y confirma que persisten. Exporta un respaldo de prueba y valida que puedas importarlo.
7. En Ajustes, configura la clave de Cohere solo si deseas probar generación. No la agregues al repositorio, README, capturas públicas ni archivos de respaldo.

Si usas la carga web de GitHub, puedes subir los archivos y carpetas del ZIP manteniendo la estructura `src/`, `docs/` y `tests/`. No subas el ZIP como único archivo esperando que Pages lo descomprima automáticamente.

## Fase 13 — Asistencia con IA para descubrir y definir
- En **Mi empresa**, usa “Ayúdame a completar mi perfil” para obtener propuestas provisionales de propuesta de valor, diferenciadores por comprobar, audiencia y preguntas de descubrimiento.
- En **Estrategia**, usa “Proponer mi estrategia con IA” para recibir una propuesta de objetivos, KPI, pilares con distribución de 100% y redes recomendadas con supuestos.
- Estas sugerencias no se guardan automáticamente: copia y valida lo que sea correcto.
- El manejo de respuestas de Cohere ahora reconoce varios formatos de contenido y ofrece diagnósticos más específicos si la respuesta no incluye texto final.
- Consulta `docs/FASE-13-ARQUITECTURA.md` y `docs/FASE-13-PRUEBAS.md`.
