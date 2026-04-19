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
    document.getElementById("fc-front").textContent = card.jp;
    document.getElementById("fc-kana").textContent = (card.kana && card.kana !== card.jp) ? card.kana : "";
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
