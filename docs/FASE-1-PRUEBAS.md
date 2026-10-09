# Fase 1 — Pruebas y resultados

## Resultado automatizado de este paquete
La prueba `node tests/smoke-test.js` inspecciona estructura, separación de módulos, contratos de datos, validación de cuestionario y controles básicos de accesibilidad. Debe ejecutarse desde la raíz del ZIP.

## Casos de prueba
| ID | Caso | Criterio | Estado |
|---|---|---|---|
| ARC-01 | Carga de scripts en orden | Storage y módulos se cargan antes del inicializador | Cubierto estáticamente |
| ARC-02 | Separación de responsabilidades | Existen módulos de navegación, persistencia, formularios y aprendizaje | Cubierto estáticamente |
| ARC-03 | Datos corruptos | Lectura JSON inválida no detiene inicialización | Cubierto por manejo de error; probar navegador |
| ARC-04 | Almacenamiento bloqueado | Se muestra error y no se afirma guardado exitoso | Cubierto por manejo de error; probar navegador |
| NAV-01 | Navegación por hash | Ruta válida se restaura; inválida cae a inicio | Cubierto parcialmente; probar navegador |
| FORM-01 | Perfil incompleto | Impide marcarlo guardado | Cubierto por lógica; probar navegador |
| FORM-02 | Estrategia incompleta | Impide guardar sin objetivo/audiencia | Cubierto por lógica; probar navegador |
| PED-01 | Quiz | Umbral 4/5 y feedback por pregunta | Cubierto por lógica; probar navegador |
| DATA-01 | Persistencia | Campos y progreso se restauran tras recarga | Cubierto por lógica; probar navegador |
| RWD-01 | Responsive | Breakpoints móvil/tablet/escritorio | Revisar visualmente |
| A11Y-01 | Teclado/foco | Controles operables y foco visible | Revisar manualmente |
| SEC-01 | Secretos | Sin claves de API incrustadas | Comprobación estática |
| REG-01 | Regresión de la Fase 0 | Lección 01 y módulos principales conservados | Cubierto por smoke tests |

## Límites
No se dispone de un navegador automatizado en este entorno. Por eso los tests estáticos no prueban renderizado real, interacción táctil, almacenamiento del navegador ni accesibilidad con tecnologías de asistencia. No se debe declarar release final hasta ejecutar los casos manuales.
