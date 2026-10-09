/* Data-access boundary. IndexedDB and migrations are intentionally deferred to Phase 2. */
(() => {
  "use strict";
  const KEY = "estudio-content-strategy-phase1-v1";
  const Storage = {
    read() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { schemaVersion: 1, data: {} };
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.schemaVersion !== 1 || typeof parsed.data !== "object") {
          return { schemaVersion: 1, data: {}, warning: "El formato local no es compatible." };
        }
        return parsed;
      } catch (_) {
        return { schemaVersion: 1, data: {}, warning: "El navegador no permitió leer los datos locales." };
      }
    },
    write(data) {
      try {
        localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), data }));
        return { ok: true };
      } catch (_) {
        return { ok: false, error: "No se pudo guardar. El almacenamiento puede estar bloqueado o lleno." };
      }
    }
  };
  window.AppStorage = Storage;
})();