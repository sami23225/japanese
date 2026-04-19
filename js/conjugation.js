// ============================================================
// conjugation.js — verb + adjective conjugation drill
// Uses GRAMMAR.conjugateVerb / conjugateAdj from data/grammar.js
// ============================================================

window.Conjugation = (function () {
  let session = null;

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Normalize for forgiving matching: trim, lowercase, strip spaces, convert katakana to hiragana
  function norm(s) {
    if (!s) return "";
    s = String(s).trim().toLowerCase().replace(/\s+/g, "");
    // katakana → hiragana
    return s.replace(/[\u30a1-\u30f6]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
  }

  function populateFormSelect() {
    const kind = document.getElementById("conj-kind").value;
    const sel = document.getElementById("conj-form");
    sel.innerHTML = "";
    const forms = kind === "verb" ? window.GRAMMAR.verbForms : window.GRAMMAR.adjForms;
    const randOpt = document.createElement("option");
    randOpt.value = "__mix__"; randOpt.textContent = "🎲 Mix (random form each Q)";
    sel.appendChild(randOpt);
    forms.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.key; opt.textContent = f.label;
      sel.appendChild(opt);
    });
  }

  function buildSession() {
    const kind = document.getElementById("conj-kind").value;
    const formKey = document.getElementById("conj-form").value;
    const pool = kind === "verb" ? window.GRAMMAR.drillVerbs : window.GRAMMAR.drillAdjectives;
    const forms = kind === "verb" ? window.GRAMMAR.verbForms : window.GRAMMAR.adjForms;
    const items = shuffle(pool).slice(0, 10).map(w => {
      const chosenKey = formKey === "__mix__"
        ? forms[Math.floor(Math.random() * forms.length)].key
        : formKey;
      const formLabel = forms.find(f => f.key === chosenKey).label;
      const answer = kind === "verb"
        ? window.GRAMMAR.conjugateVerb(w.dict, w.type, chosenKey)
        : window.GRAMMAR.conjugateAdj(w.dict, w.type, chosenKey);
      return { word: w, formKey: chosenKey, formLabel, answer, kind };
    }).filter(x => x.answer); // drop any unsupported combos
    return { items, idx: 0, correct: 0 };
  }

  function start() {
    session = buildSession();
    if (session.items.length === 0) { alert("No items to drill."); return; }
    document.getElementById("conj-stage").style.display = "block";
    renderQ();
    Store.bumpStat("drills");
  }

  function renderQ() {
    if (!session) return;
    const it = session.items[session.idx];
    document.getElementById("conj-progress").textContent = (session.idx + 1) + " / " + session.items.length;
    document.getElementById("conj-score").textContent = "Correct: " + session.correct;
    const badgeClass = it.kind === "verb" ? it.word.type : it.word.type;
    const badge = `<span class="verb-type-badge ${badgeClass}">${it.word.type}</span>`;
    document.getElementById("conj-prompt").innerHTML =
      `${it.word.dict} ${badge} <br>→ <em>${it.formLabel}</em>`;
    document.getElementById("conj-sub").textContent = it.word.en;
    const input = document.getElementById("conj-input");
    input.value = "";
    input.focus();
    document.getElementById("conj-feedback").style.display = "none";
  }

  function check() {
    if (!session) return;
    const it = session.items[session.idx];
    const given = document.getElementById("conj-input").value;
    const correct = norm(given) === norm(it.answer);
    const fb = document.getElementById("conj-feedback");
    fb.style.display = "block";
    if (correct) {
      session.correct++;
      fb.innerHTML = `<strong>✅ Correct!</strong> <br>${it.word.dict} → <strong>${it.answer}</strong>`;
      advance(900);
    } else {
      fb.innerHTML = `<strong>❌ Not quite.</strong> <br>Answer: <strong>${it.answer}</strong>`;
    }
  }

  function reveal() {
    if (!session) return;
    const it = session.items[session.idx];
    const fb = document.getElementById("conj-feedback");
    fb.style.display = "block";
    fb.innerHTML = `💡 <strong>${it.answer}</strong>`;
  }

  function skip() { advance(0); }
  function advance(delay) {
    setTimeout(() => {
      session.idx++;
      if (session.idx >= session.items.length) finish();
      else renderQ();
    }, delay);
  }

  function finish() {
    document.getElementById("conj-prompt").innerHTML = "🎉 終わり！";
    document.getElementById("conj-sub").textContent = `Score: ${session.correct} / ${session.items.length}`;
    document.getElementById("conj-input").style.display = "none";
    document.getElementById("conj-feedback").style.display = "none";
    session = null;
    App.refreshHomeStats();
  }

  function init() {
    populateFormSelect();
    document.getElementById("conj-kind").addEventListener("change", populateFormSelect);
    document.getElementById("conj-start").addEventListener("click", () => {
      document.getElementById("conj-input").style.display = "block";
      start();
    });
    document.getElementById("conj-check").addEventListener("click", check);
    document.getElementById("conj-reveal").addEventListener("click", reveal);
    document.getElementById("conj-skip").addEventListener("click", skip);
    document.getElementById("conj-input").addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); check(); }
    });
    document.getElementById("conj-quit").addEventListener("click", () => {
      document.getElementById("conj-stage").style.display = "none";
      session = null;
    });
  }

  return { init };
})();
