# Fase 9 — Dashboard y seguimiento diario

## Objetivo
Convertir la pantalla Inicio en un centro de seguimiento editorial, reutilizando los datos persistidos por las fases anteriores. No se agregan métricas de rendimiento social ni se inventan datos.

## Componentes
- `index.html`: métricas principales, prioridades, próximas piezas y guía de configuración.
- `src/dashboard.js`: lectura de IndexedDB mediante `AppStorage.read()`, cálculo de indicadores y renderizado seguro con `textContent`/nodos DOM.
- `src/navigation.js`: emite `content-commander:route-changed` para refrescar el panel al volver a Inicio.
- `src/calendar.js`: emite `content-commander:dashboard-updated` cuando se persisten cambios del calendario.
- `styles.css`: tarjetas, listas y layout responsive.

## Indicadores
- **Para hoy:** piezas activas con fecha de hoy cuyo estado no es `published`.
- **Atrasadas:** piezas con fecha anterior a hoy, excluyendo `published` y `cancelled`.
- **Revisión pendiente:** borradores en `pending-human-review` y registros legacy sin estado ni aprobación.
- **Aprobadas sin publicar:** piezas de calendario en estado `approved`. Aprobar no equivale a publicar.
- **Próximos 7 días:** piezas activas, no publicadas, entre hoy y hoy + 7 días inclusive, ordenadas por fecha/hora; muestra hasta seis.

## Persistencia y eventos
No se crea un almacén nuevo. Se consumen `data.editorialPlan`, `data.contentDrafts`, `data.company` y `data.strategy`. El dashboard escucha cambios de calendario, borradores, estrategia, navegación y foco de ventana.

## Límites
- La app no consulta plataformas sociales, no publica y no conoce el rendimiento real.
- “Atrasada” es una regla de fecha/estado, no una inferencia de incumplimiento real.
- El responsable y el estado dependen de la información que la persona registre.
- Los indicadores son operativos, no un KPI de negocio.
