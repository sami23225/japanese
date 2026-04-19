// ============================================================
// speaking.js — timed speaking prompts
// Shows prompt + countdown ring. User says answer aloud.
// Reveal sample on demand. Auto-advances after timer expires.
// ============================================================

window.Speaking = (function () {
  let queue = [];
  let idx = 0;
  let timerId = null;
  let remaining = 0;
  let totalSeconds = 0;
  let multiplier = 1;

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderTips() {
    const ul = document.getElementById("speaking-tips");
    ul.innerHTML = "";
    window.SPEAKING.tips.forEach(t => {
      const li = document.createElement("li"); li.textContent = t; ul.appendChild(li);
    });
  }

  function start() {
    multiplier = parseFloat(document.getElementById("speak-seconds").value) || 1;
    queue = shuffle(window.SPEAKING.prompts);
    idx = 0;
    document.getElementById("speak-stage").style.display = "block";
    showPrompt();
    Store.bumpStat("speaks");
  }

  function showPrompt() {
    clearInterval(timerId);
    const p = queue[idx];
    if (!p) return finish();
    document.getElementById("speak-index").textContent = `Prompt ${idx + 1} / ${queue.length}`;
    document.getElementById("speak-prompt").textContent = p.prompt;
    document.getElementById("speak-sample").textContent = p.sample;
    document.getElementById("speak-sample-en").textContent = p.sampleEn;
    document.getElementById("speak-reveal").classList.add("hidden");
    totalSeconds = Math.max(3, Math.round(p.seconds * multiplier));
    remaining = totalSeconds;
    updateRing();
    timerId = setInterval(tick, 100);
  }

  function tick() {
    remaining = Math.max(0, remaining - 0.1);
    updateRing();
    if (remaining <= 0) {
      clearInterval(timerId);
      // Auto-reveal when timer runs out
      document.getElementById("speak-reveal").classList.remove("hidden");
    }
  }

  function updateRing() {
    const pct = 1 - (remaining / totalSeconds);
    const deg = pct * 360;
    const ring = document.getElementById("speak-timer");
    ring.style.background = `conic-gradient(var(--accent) ${deg}deg, var(--bg-panel) ${deg}deg)`;
    document.getElementById("speak-digits").textContent = Math.ceil(remaining);
  }

  function next() {
    idx++;
    if (idx >= queue.length) return finish();
    showPrompt();
  }

  function reveal() {
    document.getElementById("speak-reveal").classList.remove("hidden");
  }

  function finish() {
    clearInterval(timerId);
    document.getElementById("speak-prompt").textContent = "🎉 Session done!";
    document.getElementById("speak-index").textContent = `You worked through ${queue.length} prompts.`;
    document.getElementById("speak-digits").textContent = "✓";
    document.getElementById("speak-reveal").classList.add("hidden");
    App.refreshHomeStats();
  }

  function init() {
    renderTips();
    document.getElementById("speak-start").addEventListener("click", start);
    document.getElementById("speak-next").addEventListener("click", next);
    document.getElementById("speak-show").addEventListener("click", reveal);
  }

  return { init };
})();
