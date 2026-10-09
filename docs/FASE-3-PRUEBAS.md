# Fase 3 — Registro de pruebas

## Ejecutadas en este entorno
- `node tests/smoke-test.js`: pruebas acumuladas de fases 1–2 y nuevas comprobaciones estáticas de fase 3.
- `node --check` para todos los archivos JavaScript bajo `src/` y `tests/`.
- Verificación de referencias de controles, modelos permitidos, endpoint, cabeceras, estados de revisión humana y avisos de privacidad.
- No hay una API key real disponible, por lo que no se hizo una llamada real a Cohere.

## Requieren validación manual
1. Servir la carpeta con un servidor estático (no abrir como `file://`).
2. En Ajustes, pegar una clave válida y guardar; recargar y comprobar que aparece el aviso de clave guardada sin revelar su contenido.
3. Probar conexión; comprobar éxito o un mensaje real de error.
4. Generar un borrador, recargar, confirmar que persiste y que aparece como pendiente de revisión.
5. Exportar un respaldo JSON e inspeccionarlo para comprobar que no contiene la clave.
6. Eliminar la clave y comprobar que una nueva generación queda bloqueada hasta configurar una clave.
7. Probar un modelo sin acceso, clave inválida, desconexión y posibles errores CORS.

## Resultado
Las pruebas estáticas verifican la presencia de los contratos y reglas del cliente, no demuestran disponibilidad del servicio, CORS, validez de una clave ni comportamiento real del navegador. Esas verificaciones quedan explícitamente pendientes.
