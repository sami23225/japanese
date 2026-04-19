// ============================================================
// quiz.js — multiple choice quizzes
// Types:
//  - particle: fill-in from GRAMMAR.particleDrill
//  - vocab-jp-en: given JP, pick EN meaning
//  - vocab-en-jp: given EN, pick JP word
// ============================================================

window.Quiz = (function () {
  const NUM_QS = 10;
  let session = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickOptions(pool, correctItem, getLabel, n = 4) {
    const others = shuffle(pool.filter(x => getLabel(x) !== getLabel(correctItem))).slice(0, n - 1);
    return shuffle([correctItem, ...others]);
  }

  function build(type, deckId) {
    if (type === "particle") {
      const items = shuffle(window.GRAMMAR.particleDrill).slice(0, NUM_QS);
      return items.map(it => ({
        promptHtml: `<div class="prompt-jp">${it.jp.replace("___", '<span class="blank">___</span>')}</div>
                     <div class="prompt-en">${it.en}</div>`,
        options: shuffle(it.options),
        answer: it.answer,
        why: it.why,
      }));
    }
    const deck = window.DECKS[deckId];
    if (!deck) return [];
    const pool = deck.cards;
    const picks = shuffle(pool).slice(0, Math.min(NUM_QS, pool.length));
    if (type === "vocab-jp-en") {
      return picks.map(c => {
        const opts = pickOptions(pool, c, x => x.en, 4).map(x => x.en);
        return {
          promptHtml: `<div class="prompt-jp">${c.jp}</div>
                       <div class="prompt-en">${c.kana && c.kana !== c.jp ? c.kana : ""}</div>`,
          options: opts,
          answer: c.en,
          why: c.notes || "",
        };
      });
    }
    // vocab-en-jp
    return picks.map(c => {
      const opts = pickOptions(pool, c, x => x.jp, 4).map(x => x.jp);
      return {
        promptHtml: `<div class="prompt-jp" style="font-size:26px">${c.en}</div>
                     <div class="prompt-en">which is this word?</div>`,
        options: opts,
        answer: c.jp,
        why: c.kana && c.kana !== c.jp ? (c.kana + " · " + (c.romaji || "")) : (c.romaji || ""),
      };
    });
  }

  function start() {
    const type = document.getElementById("quiz-type").value;
    const deckId = document.getElementById("quiz-deck").value;
    const items = build(type, deckId);
    if (items.length === 0) { alert("No items to quiz on."); return; }
    session = { items, idx: 0, correct: 0 };
    document.getElementById("quiz-stage").style.display = "block";
    renderQuestion();
    Store.bumpStat("quizzes");
  }

  function renderQuestion() {
    const q = session.items[session.idx];
    document.getElementById("quiz-progress").textContent = (session.idx + 1) + " / " + session.items.length;
    document.getElementById("quiz-score").textContent = "Score: " + session.correct;
    document.getElementById("quiz-q").innerHTML = q.promptHtml;
    const optWrap = document.getElementById("quiz-options");
    optWrap.innerHTML = "";
    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = opt;
      b.addEventListener("click", () => choose(b, opt));
      optWrap.appendChild(b);
    });
    document.getElementById("quiz-feedback").style.display = "none";
  }

  function choose(btn, opt) {
    const q = session.items[session.idx];
    const optWrap = document.getElementById("quiz-options");
    [...optWrap.children].forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) b.classList.add("correct");
    });
    const correct = opt === q.answer;
    if (correct) session.correct++;
    else btn.classList.add("wrong");
    const fb = document.getElementById("quiz-feedback");
    fb.style.display = "block";
    fb.innerHTML = correct
      ? `<strong>✅ Correct!</strong> ${q.why ? "<br>" + q.why : ""}`
      : `<strong>❌ Answer: ${q.answer}</strong> ${q.why ? "<br>" + q.why : ""}`;
    setTimeout(() => {
      session.idx++;
      if (session.idx >= session.items.length) finish();
      else renderQuestion();
    }, correct ? 900 : 2000);
  }

  function finish() {
    document.getElementById("quiz-q").innerHTML =
      `<div class="prompt-jp">🎉 お疲れさま！</div>
       <div class="prompt-en">Score: ${session.correct} / ${session.items.length}</div>`;
    document.getElementById("quiz-options").innerHTML = "";
    document.getElementById("quiz-feedback").style.display = "none";
    session = null;
    App.refreshHomeStats();
  }

  function populateDeckSelect() {
    const sel = document.getElementById("quiz-deck");
    sel.innerHTML = "";
    Object.values(window.DECKS).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id; opt.textContent = d.emoji + " " + d.title;
      sel.appendChild(opt);
    });
  }

  function onTypeChange() {
    const type = document.getElementById("quiz-type").value;
    const deckSel = document.getElementById("quiz-deck");
    deckSel.style.display = type === "particle" ? "none" : "";
  }

  function init() {
    populateDeckSelect();
    document.getElementById("quiz-type").addEventListener("change", onTypeChange);
    document.getElementById("quiz-start").addEventListener("click", start);
    document.getElementById("quiz-quit").addEventListener("click", () => {
      document.getElementById("quiz-stage").style.display = "none";
      session = null;
    });
    onTypeChange();
  }

  return { init };
})();
