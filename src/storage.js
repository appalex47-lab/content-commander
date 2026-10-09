/* Fase 2: persistencia IndexedDB, migración segura y respaldo JSON versionado. */
(() => {
  "use strict";
  const DB_NAME = "estudio-content-commander";
  const DB_VERSION = 1;
  const STORE = "workspace";
  const RECORD_KEY = "primary";
  const LEGACY_KEY = "estudio-content-strategy-phase1-v1";
  const BACKUP_VERSION = 1;
  let dbPromise;

  function openDB() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("Este navegador no ofrece IndexedDB."));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("No se pudo abrir la base local."));
      request.onblocked = () => reject(new Error("Cierra otras pestañas de esta app e inténtalo de nuevo."));
    });
    return dbPromise;
  }
  function requestPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Falló la operación de almacenamiento."));
    });
  }
  async function getRecord() {
    const db = await openDB();
    return requestPromise(db.transaction(STORE, "readonly").objectStore(STORE).get(RECORD_KEY));
  }
  async function putRecord(data) {
    const db = await openDB();
    const record = { id: RECORD_KEY, schemaVersion: DB_VERSION, updatedAt: new Date().toISOString(), data };
    const transaction = db.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).put(record);
    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("No se pudo completar la transacción."));
      transaction.onabort = () => reject(transaction.error || new Error("La transacción de guardado fue cancelada."));
    });
    return { ok: true, updatedAt: record.updatedAt };
  }
  function validData(data) {
    return Boolean(data && typeof data === "object" && !Array.isArray(data));
  }
  async function migrateLegacy() {
    const current = await getRecord();
    if (current) return { migrated: false };
    let raw;
    try { raw = localStorage.getItem(LEGACY_KEY); }
    catch (_) { return { migrated: false, warning: "No se pudo revisar el almacenamiento anterior." }; }
    if (!raw) return { migrated: false };
    try {
      const legacy = JSON.parse(raw);
      if (!legacy || legacy.schemaVersion !== 1 || !validData(legacy.data)) {
        return { migrated: false, warning: "Los datos anteriores tienen un formato no reconocido; no se modificaron." };
      }
      await putRecord(legacy.data);
      // Keep legacy copy until user verifies the migration; it is not deleted automatically.
      return { migrated: true, warning: "Datos anteriores migrados a IndexedDB. La copia original se conserva como precaución." };
    } catch (_) {
      return { migrated: false, warning: "No se pudo migrar automáticamente el almacenamiento anterior; la copia original se conserva." };
    }
  }
  async function init() {
    const migration = await migrateLegacy();
    const record = await getRecord();
    return { schemaVersion: DB_VERSION, data: record && validData(record.data) ? record.data : {}, ...migration };
  }
  async function read() {
    try {
      const record = await getRecord();
      if (!record) return { schemaVersion: DB_VERSION, data: {} };
      if (record.schemaVersion !== DB_VERSION || !validData(record.data)) return { schemaVersion: DB_VERSION, data: {}, warning: "El formato guardado no es compatible; no se sobrescribió." };
      return { schemaVersion: DB_VERSION, updatedAt: record.updatedAt, data: record.data };
    } catch (error) {
      return { schemaVersion: DB_VERSION, data: {}, warning: error.message || "No se pudo leer IndexedDB." };
    }
  }
  async function write(data) {
    if (!validData(data)) return { ok: false, error: "Los datos que intentas guardar no tienen un formato válido." };
    try { return await putRecord(data); }
    catch (error) { return { ok: false, error: error && error.name === "QuotaExceededError" ? "El almacenamiento está lleno. Exporta un respaldo y libera espacio." : (error.message || "No se pudo guardar en IndexedDB.") }; }
  }
  async function createBackup() {
    const state = await read();
    if (state.warning) throw new Error(state.warning);
    const payload = { app: "Content Commander", backupVersion: BACKUP_VERSION, schemaVersion: DB_VERSION, exportedAt: new Date().toISOString(), data: state.data };
    return JSON.stringify(payload, null, 2);
  }
  function validateBackup(input) {
    let payload;
    try { payload = typeof input === "string" ? JSON.parse(input) : input; }
    catch (_) { return { ok: false, error: "El archivo no contiene JSON válido." }; }
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || payload.app !== "Content Commander" || payload.backupVersion !== BACKUP_VERSION || payload.schemaVersion !== DB_VERSION || !validData(payload.data)) {
      return { ok: false, error: "El respaldo no es de Content Commander o su versión/formato no es compatible. Verifica la versión del respaldo y del esquema." };
    }
    const data = { ...payload.data };
    // Never import API credentials, even if a future or edited backup includes them.
    delete data.cohereApiKey; delete data.apiKey; delete data.apiKeys;
    return { ok: true, preview: { exportedAt: payload.exportedAt || "Fecha no indicada", sections: Object.keys(data), sectionCount: Object.keys(data).length }, data };
  }
  async function importBackup(input, mode = "replace") {
    const checked = validateBackup(input);
    if (!checked.ok) return checked;
    if (mode !== "replace" && mode !== "merge") return { ok: false, error: "Modo de importación no válido." };
    let next = checked.data;
    if (mode === "merge") {
      const existing = await read();
      if (existing.warning) return { ok: false, error: existing.warning };
      next = { ...existing.data, ...checked.data };
    }
    const saved = await write(next);
    return saved.ok ? { ok: true, importedSections: Object.keys(checked.data).length, mode } : saved;
  }
  window.AppStorage = { init, read, write, createBackup, validateBackup, importBackup, constants: { DB_NAME, DB_VERSION, BACKUP_VERSION } };
})();
