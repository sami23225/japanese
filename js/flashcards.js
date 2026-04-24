// ============================================================
// flashcards.js — Leitner-box SRS flashcards
// Boxes 0..4. Intervals in hours: 0→0.1, 1→12, 2→48, 3→168, 4→336
// Ratings: again→box 0 (and lapse), hard→same box, good→+1, easy→+2
// ============================================================

window.Flashcards = (function () {
  const INTERVALS = [0.1, 12, 48, 168, 336]; // hours

  let deck = null;
  let order = [];        // indices of cards in current session (due + new)
  let idx = 0;
  let flipped = false;
  let srsState = {};     // mutable copy

  function cardKey(card) { return card.jp + "|" + card.en; }

  // ---- Furigana helpers ----
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function isKanji(c) {
    const code = c.codePointAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF) || code === 0x3005;
  }
  function isKana(c) {
    const code = c.codePointAt(0);
    return (code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF) || code === 0x30FC;
  }
  // Build HTML with <ruby> furigana, aligning the `kana` reading to each
  // kanji block in `jp`. Hiragana/katakana inside jp acts as anchor points.
  // Examples:
  //   "食べる"/"たべる"  → <ruby>食<rt>た</rt></ruby>べる
  //   "食べ物"/"たべもの" → <ruby>食<rt>た</rt></ruby>べ<ruby>物<rt>もの</rt></ruby>
  //   "お父さん"/"おとうさん" → お<ruby>父<rt>とう</rt></ruby>さん
  //   "学校"/"がっこう"   → <ruby>学校<rt>がっこう</rt></ruby>
  function buildFurigana(jp, kana) {
    if (!jp) return "";
    if (!kana || kana === jp) return escapeHtml(jp);
    // Group jp into runs of kanji ('k'), kana ('h'), or other ('o')
    const runs = [];
    let curType = null, curText = "";
    for (const c of jp) {
      const t = isKanji(c) ? "k" : (isKana(c) ? "h" : "o");
      if (t === curType) { curText += c; }
      else { if (curText) runs.push({ type: curType, text: curText }); curType = t; curText = c; }
    }
    if (curText) runs.push({ type: curType, text: curText });
    // No kanji at all → just plain text
    if (!runs.some(r => r.type === "k")) return escapeHtml(jp);
    // Walk through, allocating chunks of the kana string to each kanji run
    let kIdx = 0, html = "";
    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      if (run.type !== "k") {
        // Anchor: skip same length in kana (best-effort — don't fail if mismatched)
        kIdx = Math.min(kana.length, kIdx + run.text.length);
        html += escapeHtml(run.text);
      } else {
        // Find next kana anchor to know where this kanji's reading ends
        let nextAnchor = "";
        for (let j = i + 1; j < runs.length; j++) {
          if (runs[j].type === "h") { nextAnchor = runs[j].text; break; }
        }
        let endIdx;
        if (nextAnchor) {
          endIdx = kana.indexOf(nextAnchor, kIdx);
          if (endIdx === -1) endIdx = kana.length;
        } else {
          endIdx = kana.length;
        }
        const reading = kana.slice(kIdx, endIdx);
        kIdx = endIdx;
        if (reading) {
          html += '<ruby>' + escapeHtml(run.text) + '<rt>' + escapeHtml(reading) + '</rt></ruby>';
        } else {
          html += escapeHtml(run.text);
        }
      }
    }
    return html;
  }
  // Does the JP string contain any kanji?
  function hasKanji(jp) {
    if (!jp) return false;
    for (const c of jp) if (isKanji(c)) return true;
    return false;
  }

  function loadDeck(deckObj) {
    deck = deckObj;
    srsState = Store.getSrs(deck.id);
    // Build session list: all due cards + any new
    const now = Date.now();
    const dueIdx = [];
    const newIdx = [];
    deck.cards.forEach((c, i) => {
      const k = cardKey(c);
      const s = srsState[k];
      if (!s) newIdx.push(i);
      else if (s.nextDue <= now) dueIdx.push(i);
    });
    // Shuffle new cards, keep due in order
    for (let i = newIdx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newIdx[i], newIdx[j]] = [newIdx[j], newIdx[i]];
    }
    order = [...dueIdx, ...newIdx];
    if (order.length === 0) {
      // Everything is scheduled in future — just review all as a re-browse
      order = deck.cards.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    idx = 0;
    flipped = false;
    render();
  }

  function currentCard() {
    if (!deck) return null;
    return deck.cards[order[idx]];
  }

  function render() {
    const card = currentCard();
    const stage = document.getElementById("flashcard-stage");
    if (!card) {
      stage.innerHTML = '<div class="empty">🎉 Deck finished! Come back later or <button class="btn small" id="fc-again">review again</button>.</div>';
      document.getElementById("fc-again").onclick = () => loadDeck(deck);
      return;
    }
    const front = document.getElementById("fc-front");
    const kanaEl = document.getElementById("fc-kana");
    if (hasKanji(card.jp) && card.kana && card.kana !== card.jp) {
      // Render with furigana ruby — hide separate kana line (redundant)
      front.innerHTML = buildFurigana(card.jp, card.kana);
      kanaEl.textContent = "";
      kanaEl.style.display = "none";
    } else {
      // Pure kana / single-char kana / no reading — plain text
      front.textContent = card.jp;
      kanaEl.textContent = (card.kana && card.kana !== card.jp) ? card.kana : "";
      kanaEl.style.display = "";
    }
    document.getElementById("fc-en").textContent = card.en;
    document.getElementById("fc-romaji").textContent = card.romaji || "";
    document.getElementById("fc-notes").textContent = card.notes || "";
    document.getElementById("fc-progress").textContent = (idx + 1) + " / " + order.length;
    const k = cardKey(card);
    const s = srsState[k];
    document.getElementById("fc-srs-meta").textContent = s
      ? "Box " + s.box + (s.lapses ? " · lapses " + s.lapses : "")
      : "new card";
    const fc = document.getElementById("flashcard");
    fc.classList.toggle("flipped", flipped);
  }

  function flip() { flipped = !flipped; render(); }

  function rate(rating) {
    if (!flipped) { flip(); return; }
    const card = currentCard();
    if (!card) return;
    const k = cardKey(card);
    const prev = srsState[k] || { box: 0, nextDue: 0, lapses: 0 };
    let box = prev.box;
    let lapses = prev.lapses;
    if (rating === "again") { box = 0; lapses++; }
    else if (rating === "hard") { /* keep */ }
    else if (rating === "good") { box = Math.min(4, box + 1); }
    else if (rating === "easy") { box = Math.min(4, box + 2); }
    const hrs = INTERVALS[box];
    srsState[k] = { box, lapses, nextDue: Date.now() + hrs * 3600_000 };
    Store.setSrs(deck.id, srsState);
    Store.bumpStat("reviews");
    if (rating !== "again") Store.bumpStat("correct");
    idx++;
    flipped = false;
    render();
    App.refreshHomeStats();
  }

  function attachHandlers() {
    document.getElementById("flashcard").addEventListener("click", flip);
    document.addEventListener("keydown", (e) => {
      if (!document.getElementById("panel-flashcards").classList.contains("active")) return;
      if (document.getElementById("flashcard-stage").style.display === "none") return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (e.key === "1") rate("again");
      else if (e.key === "2") rate("hard");
      else if (e.key === "3") rate("good");
      else if (e.key === "4") rate("easy");
    });
    document.querySelectorAll("#fc-ratings .rating-btn").forEach(btn => {
      btn.addEventListener("click", () => rate(btn.dataset.rating));
    });
    document.getElementById("fc-reset").addEventListener("click", () => {
      if (!deck) return;
      if (confirm("Reset SRS state for this deck?")) {
        Store.setSrs(deck.id, {});
        loadDeck(deck);
      }
    });
  }

  function renderDeckPicker() {
    const grid = document.getElementById("deck-picker");
    grid.innerHTML = "";
    Object.values(window.DECKS).forEach(deckObj => {
      const btn = document.createElement("button");
      btn.className = "deck-card";
      btn.innerHTML = `<span class="emoji">${deckObj.emoji}</span>
        <div class="title">${deckObj.title}</div>
        <div class="count">${deckObj.cards.length} cards</div>`;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".deck-card").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        document.getElementById("flashcard-stage").style.display = "block";
        loadDeck(deckObj);
      });
      grid.appendChild(btn);
    });
  }

  function init() {
    renderDeckPicker();
    attachHandlers();
  }

  return { init, loadDeck };
})();
