// ============================================================
// romaji.js — romaji ↔ hiragana
// Type "tabemasu" and it becomes たべます automatically.
// Handles: single kana, digraphs (kya, sho, ja, cha, etc.),
// small tsu (double consonants → っ), and ん (n).
// ============================================================

window.Romaji = (function () {

  const MAP = {
    // 3-char digraphs
    "kya":"きゃ","kyu":"きゅ","kyo":"きょ",
    "gya":"ぎゃ","gyu":"ぎゅ","gyo":"ぎょ",
    "sha":"しゃ","shu":"しゅ","sho":"しょ","shi":"し",
    "ja":"じゃ","ju":"じゅ","jo":"じょ","ji":"じ",
    "cha":"ちゃ","chu":"ちゅ","cho":"ちょ","chi":"ち",
    "tsu":"つ","tsa":"つぁ","tse":"つぇ","tso":"つぉ",
    "nya":"にゃ","nyu":"にゅ","nyo":"にょ",
    "hya":"ひゃ","hyu":"ひゅ","hyo":"ひょ",
    "bya":"びゃ","byu":"びゅ","byo":"びょ",
    "pya":"ぴゃ","pyu":"ぴゅ","pyo":"ぴょ",
    "mya":"みゃ","myu":"みゅ","myo":"みょ",
    "rya":"りゃ","ryu":"りゅ","ryo":"りょ",
    "dya":"ぢゃ","dyu":"ぢゅ","dyo":"ぢょ",

    // 2-char
    "ka":"か","ki":"き","ku":"く","ke":"け","ko":"こ",
    "ga":"が","gi":"ぎ","gu":"ぐ","ge":"げ","go":"ご",
    "sa":"さ","su":"す","se":"せ","so":"そ",
    "za":"ざ","zu":"ず","ze":"ぜ","zo":"ぞ","zi":"じ",
    "ta":"た","ti":"ち","te":"て","to":"と",
    "da":"だ","di":"ぢ","du":"づ","de":"で","do":"ど",
    "na":"な","ni":"に","nu":"ぬ","ne":"ね","no":"の",
    "ha":"は","hi":"ひ","fu":"ふ","hu":"ふ","he":"へ","ho":"ほ",
    "ba":"ば","bi":"び","bu":"ぶ","be":"べ","bo":"ぼ",
    "pa":"ぱ","pi":"ぴ","pu":"ぷ","pe":"ぺ","po":"ぽ",
    "ma":"ま","mi":"み","mu":"む","me":"め","mo":"も",
    "ya":"や","yu":"ゆ","yo":"よ",
    "ra":"ら","ri":"り","ru":"る","re":"れ","ro":"ろ",
    "wa":"わ","wi":"ゐ","we":"ゑ","wo":"を",
    "nn":"ん","n'":"ん",

    // 1-char vowels
    "a":"あ","i":"い","u":"う","e":"え","o":"お",

    // Punctuation / symbols
    "-":"ー",",":"、",".":"。","?":"？","!":"！","~":"〜"," ":" ",
  };

  const VOWELS = "aeiou";

  function toKana(input) {
    if (!input) return "";
    const s = input.toLowerCase();
    let out = "";
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      const next = s[i + 1] || "";

      // Small tsu: doubled consonant (not aeiou, not n)
      if (ch === next && ch !== "n" && !VOWELS.includes(ch) && /[a-z]/.test(ch)) {
        out += "っ";
        i++;
        continue;
      }

      // "n" before a non-vowel, non-y, non-n consonant  → ん
      if (ch === "n" && next && !VOWELS.includes(next) && next !== "y" && next !== "n" && /[a-z]/.test(next)) {
        out += "ん";
        i++;
        continue;
      }

      // Longest match: try 3-char, then 2-char, then 1-char
      const tri = s.slice(i, i + 3);
      if (tri.length === 3 && MAP[tri]) { out += MAP[tri]; i += 3; continue; }
      const di = s.slice(i, i + 2);
      if (di.length === 2 && MAP[di]) { out += MAP[di]; i += 2; continue; }
      if (MAP[ch]) { out += MAP[ch]; i++; continue; }

      // Lone trailing "n"  → ん
      if (ch === "n" && i === s.length - 1) { out += "ん"; i++; continue; }

      // Pass-through (keep partial typing visible, e.g. "t")
      out += ch; i++;
    }
    return out;
  }

  // Attach to an <input> so typing romaji auto-converts.
  // Preserves caret position at end (where typing happens).
  function bindInput(input) {
    let lastKana = "";
    input.addEventListener("input", () => {
      // Only re-process if input changed. Convert on every keystroke.
      // Keep any already-typed Japanese characters untouched.
      const raw = input.value;
      // Split into [non-roman chunks, roman chunks] and only convert roman chunks
      const converted = raw.replace(/[a-zA-Z'\-]+/g, m => toKana(m));
      if (converted !== raw) {
        input.value = converted;
        // Move caret to end
        const len = converted.length;
        input.setSelectionRange(len, len);
      }
      lastKana = converted;
    });
  }

  return { toKana, bindInput };
})();
