# Fase 2 — Persistencia, migración y respaldos

## Alcance

- IndexedDB como almacenamiento principal en la base `estudio-content-commander`, versión 1, almacén `workspace`.
- Un registro principal (`primary`) contiene el estado de la aplicación y su versión de esquema.
- La interfaz usa una frontera asíncrona `window.AppStorage` (`init`, `read`, `write`, `createBackup`, `validateBackup`, `importBackup`).
- Migración automática y conservadora desde `localStorage` bajo la clave `estudio-content-strategy-phase1-v1`. La clave antigua no se elimina para permitir recuperación manual.
- Respaldo JSON versionado con `app`, `backupVersion`, `schemaVersion`, `exportedAt` y `data`.
- Validación previa, vista previa de secciones, importación por reemplazo o combinación y confirmación antes de escribir.
- Las claves `cohereApiKey`, `apiKey` y `apiKeys` se excluyen al importar. El exportador no incluye configuración de credenciales.

## Contrato de persistencia

`read()` devuelve `{schemaVersion, data, updatedAt?, warning?}`. `write(data)` devuelve `{ok, updatedAt?}` o `{ok:false,error}`. El estado completo se guarda como un único registro, de modo que cada escritura reemplaza de forma atómica el documento del espacio de trabajo. No se guardan datos de terceros ni se realiza sincronización en la nube.

## Importación

1. El usuario selecciona un archivo JSON de hasta 10 MB.
2. `validateBackup` analiza JSON y exige el nombre de app, la versión de respaldo admitida y un objeto `data`.
3. La interfaz muestra fecha declarada y nombres de secciones.
4. El usuario elige reemplazo o combinación y confirma.
5. Se guarda el documento y se restauran los formularios y el progreso.

En modo combinación, las secciones importadas prevalecen sobre las existentes; las demás se conservan. Es una combinación por secciones, no una fusión profunda de objetos internos.

## Límites y privacidad

- IndexedDB se limita al navegador y al origen (dominio/protocolo/puerto). Borrar datos del sitio puede borrar el almacén.
- El archivo JSON puede contener información empresarial; debe almacenarse de forma segura.
- La aplicación estática no tiene backend ni sincronización entre dispositivos.
- Las pruebas smoke verifican contratos y presencia de rutas de código, no sustituyen pruebas reales en navegadores.
- La copia legacy permanece en localStorage después de migrar. El usuario puede borrarla manualmente cuando confirme el respaldo, pero no se borra automáticamente.
