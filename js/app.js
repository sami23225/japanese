// ============================================================
// app.js — main controller: tab nav, home stats, init
// ============================================================

window.App = (function () {

  function setTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tabId);
    });
    document.querySelectorAll(".panel").forEach(p => {
      p.classList.toggle("active", p.id === "panel-" + tabId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function refreshHomeStats() {
    const s = Store.getStats();
    const box = document.getElementById("home-stats");
    const pct = s.reviews ? Math.round((s.correct / s.reviews) * 100) : 0;
    box.innerHTML = `
      <div class="stat"><div class="n">${s.reviews || 0}</div><div class="lbl">Card reviews</div></div>
      <div class="stat"><div class="n">${pct}%</div><div class="lbl">Accuracy</div></div>
      <div class="stat"><div class="n">${s.quizzes || 0}</div><div class="lbl">Quizzes</div></div>
      <div class="stat"><div class="n">${s.drills || 0}</div><div class="lbl">Conj. drills</div></div>
      <div class="stat"><div class="n">${s.speaks || 0}</div><div class="lbl">Speaking sessions</div></div>
    `;
  }

  function attachNav() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });
    document.querySelectorAll("[data-goto]").forEach(el => {
      el.addEventListener("click", () => setTab(el.dataset.goto));
    });
  }

  function init() {
    attachNav();
    refreshHomeStats();
    Flashcards.init();
    Quiz.init();
    Conjugation.init();
    Speaking.init();
    Reference.init();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { setTab, refreshHomeStats };
})();
