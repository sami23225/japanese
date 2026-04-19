// ============================================================
// storage.js — thin wrapper over localStorage for SRS + stats
// ============================================================

window.Store = (function () {
  const KEY_PREFIX = "jpstudy:";
  function read(key, fallback) {
    try {
      const v = localStorage.getItem(KEY_PREFIX + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value)); }
    catch (e) { /* quota, private mode, etc. — fail silently */ }
  }
  function clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(KEY_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  // Per-deck SRS state
  // Keyed by deckId → { cardKey: { box: 0..4, nextDue: timestamp, lapses: n } }
  function getSrs(deckId) { return read("srs:" + deckId, {}); }
  function setSrs(deckId, state) { write("srs:" + deckId, state); }

  // Aggregate stats
  function getStats() {
    return read("stats", { reviews: 0, correct: 0, quizzes: 0, drills: 0, speaks: 0 });
  }
  function bumpStat(key, by = 1) {
    const s = getStats(); s[key] = (s[key] || 0) + by; write("stats", s);
  }

  return { read, write, clearAll, getSrs, setSrs, getStats, bumpStat };
})();
