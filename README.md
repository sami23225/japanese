# 日本語 Study — Samira's Japanese Module

A personal, self-updating Japanese study site. Static HTML + vanilla JS, designed for GitHub Pages. No build step.

## What it does

- **Flashcards with Leitner-box SRS** — rate `Again / Hard / Good / Easy`; cards resurface on schedule. Progress saved in your browser's `localStorage`.
- **Quiz mode** — multiple choice for particles (は/が/を/に/で…), JP→EN vocab, EN→JP vocab.
- **Conjugation drill** — type the correct form in kana. Covers polite/past/negative/te/nai/potential/volitional for verbs and all major adjective forms. Has a mix mode that picks a random form each question.
- **Speaking practice** — timed prompts with a countdown ring. The point is to force output before you feel "ready."
- **Reference** — particle cheat sheet + conjugation tables, auto-generated from the same data the drills use.

## Content calibration

Calibrated for **upper N5 → early N4**. Targets these weak spots: particle choice, verb conjugation speed, i-adj vs na-adj endings, vocab recall speed.

## Running locally

No build step. Either:

```bash
# Python (any version)
cd japanese
python3 -m http.server 8000
# open http://localhost:8000
```

or just open `index.html` directly in the browser.

## Deploying to GitHub Pages

Since your repo is named `japanese`:

```bash
# from inside the japanese folder
git init
git add .
git commit -m "Initial study module"
git branch -M main
git remote add origin git@github.com:<your-username>/japanese.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Branch: `main`, folder: `/ (root)` → Save**.

After ~1 minute your site will be live at `https://<your-username>.github.io/japanese/`.

### Updating content

Every time you edit a `data/*.js` file and push:

```bash
git add data/
git commit -m "Add new vocab"
git push
```

Pages redeploys in 30-60 seconds.

## Adding new content

Everything studiable lives in `data/`. No code changes needed to add content.

### Add a new vocab deck

Open `data/vocab.js` and add a new entry to `window.DECKS`:

```js
window.DECKS.myNewDeck = {
  id: "myNewDeck",                 // unique string, no spaces
  title: "Food & Restaurants",
  emoji: "🍜",
  description: "Short description shown on the deck card.",
  cards: [
    { jp: "寿司", kana: "すし", romaji: "sushi", en: "sushi" },
    { jp: "ラーメン", kana: "ラーメン", romaji: "rāmen", en: "ramen",
      notes: "optional hint shown on the back of the card" },
  ],
};
```

It automatically appears in the Flashcards picker and the Quiz deck dropdown.

### Add particle drill questions

Open `data/grammar.js` and push into `window.GRAMMAR.particleDrill`:

```js
{ jp: "___を飲みます。", answer: "みず", options: ["みず","ビール"], en: "...", why: "..." },
```

(For fill-ins that aren't particles, any short-answer shape works — options are shuffled.)

### Add a verb or adjective to the drill

In `data/grammar.js`, add to `drillVerbs` or `drillAdjectives`:

```js
{ dict: "およぐ", type: "u", en: "swim" },   // dict form in KANA
{ dict: "たかい", type: "i", en: "expensive" },
```

The conjugation engine handles all forms automatically.

### Add speaking prompts

`data/speaking.js` → push into `window.SPEAKING.prompts`:

```js
{ prompt: "Say: \"I'm tired today.\"",
  sample: "今日は疲れています。",
  sampleEn: "I'm tired today.",
  seconds: 8, tags: ["daily"] },
```

## File layout

```
japanese/
├── index.html            # app shell, tabs
├── README.md             # this file
├── css/
│   └── style.css         # warm & cute theme
├── js/
│   ├── app.js            # tab nav, init, home stats
│   ├── storage.js        # localStorage wrapper
│   ├── flashcards.js     # SRS engine + UI
│   ├── quiz.js           # multiple choice engine
│   ├── conjugation.js    # type-in drill
│   ├── speaking.js       # timer + prompts
│   └── reference.js      # particle/cheat-sheet rendering
└── data/
    ├── vocab.js          # all flashcard decks
    ├── grammar.js        # particles + conjugation rules + drill words
    └── speaking.js       # timed prompts
```

## Study loop (20 min / day)

1. **5 min** — flashcards (today's due cards).
2. **5 min** — quiz (one particle round + one vocab round).
3. **5 min** — conjugation drill (mix mode, 10 verbs + 5 adjectives, out loud).
4. **5 min** — speaking (3-5 prompts under timer; don't pause to think).

がんばって！
