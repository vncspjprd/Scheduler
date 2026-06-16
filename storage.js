// storage.js - localStorage persistence layer

const STORAGE_KEY = "vincentOSState";

let _syncDebounceTimer = null;

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Storage._mergeWithDefaults(parsed);
      }
    } catch (e) {
      console.warn("Failed to load state, using defaults", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  },

  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state", e);
    }
    // Debounced push to cloud (if linked) so rapid edits don't spam Firestore
    if (typeof CloudSync !== "undefined" && CloudSync.hasSyncCode()) {
      if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
      _syncDebounceTimer = setTimeout(() => {
        CloudSync.push(state);
      }, 1200);
    }
  },

  // Ensure any missing top-level keys (from older saved versions) fall back to defaults
  _mergeWithDefaults(parsed) {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_STATE));
    const merged = Object.assign({}, defaults, parsed);
    // Deep-merge schedule so new days/modes added later don't break old saves
    if (!parsed.schedule) merged.schedule = defaults.schedule;
    if (!parsed.dateSchedules) merged.dateSchedules = defaults.dateSchedules;
    if (!parsed.course) merged.course = defaults.course;
    if (!parsed.cseSubjects) merged.cseSubjects = defaults.cseSubjects;
    if (!parsed.sleepLog) merged.sleepLog = defaults.sleepLog;
    if (!parsed.journal) merged.journal = defaults.journal;
    if (!parsed.streak) merged.streak = defaults.streak;
    return merged;
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },
};