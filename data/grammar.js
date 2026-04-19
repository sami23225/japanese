// ============================================================
// GRAMMAR DATA
// Particle explanations + sentence drills for particles,
// verb conjugation, and adjective conjugation.
// ============================================================

window.GRAMMAR = window.GRAMMAR || {};

// ---------- Particle reference cards ----------
window.GRAMMAR.particles = [
  {
    particle: "は",
    name: "wa (topic)",
    core: "Marks the TOPIC. 'As for X…' — the thing the sentence is about.",
    whenUse: "Introducing what you're talking about, or contrasting it with something else.",
    hint: "Pronounced 'wa', written は.",
    examples: [
      { jp: "私は学生です。", en: "As for me, I'm a student. (I'm a student.)" },
      { jp: "今日は暑いです。", en: "Today is hot. (It's hot today.)" },
    ],
  },
  {
    particle: "が",
    name: "ga (subject)",
    core: "Marks the SUBJECT — especially when introducing new info or answering 'who/what'.",
    whenUse: "When identifying who did something, with 好き・嫌い・ある・いる, or for new info.",
    hint: "If you could answer 'who?' or 'what?' with it, it's probably が.",
    examples: [
      { jp: "猫がいます。", en: "There's a cat." },
      { jp: "コーヒーが好きです。", en: "I like coffee. (Coffee is liked.)" },
    ],
  },
  {
    particle: "を",
    name: "o (direct object)",
    core: "Marks the DIRECT OBJECT of an action.",
    whenUse: "After a noun that's being acted on by a transitive verb (eat, drink, read, make, see…).",
    hint: "Pronounced 'o'. If something is being DONE to a thing, that thing gets を.",
    examples: [
      { jp: "寿司を食べます。", en: "I eat sushi." },
      { jp: "本を読みます。", en: "I read a book." },
    ],
  },
  {
    particle: "に",
    name: "ni (target/time)",
    core: "Marks a TARGET — destination, time, indirect object, or existence location.",
    whenUse: "Going to a place, doing something at a time, giving to someone, something exists at a place.",
    hint: "Static location (something IS there) uses に. Actions happening at a place use で.",
    examples: [
      { jp: "学校に行きます。", en: "I go TO school." },
      { jp: "7時に起きます。", en: "I wake up AT 7." },
      { jp: "公園にいます。", en: "I'm at the park. (static existence)" },
    ],
  },
  {
    particle: "で",
    name: "de (location of action / means)",
    core: "Marks WHERE an action happens, or the MEANS used to do it.",
    whenUse: "An action happening at a place, or a tool/method used.",
    hint: "If the verb is something active (eat, study, play), use で for the place.",
    examples: [
      { jp: "図書館で勉強します。", en: "I study AT the library." },
      { jp: "電車で行きます。", en: "I go BY train." },
    ],
  },
  {
    particle: "へ",
    name: "e (direction)",
    core: "Marks DIRECTION of movement. Very similar to に for destinations.",
    whenUse: "Going toward a place. Pronounced 'e'.",
    hint: "In modern usage, に is more common; へ feels slightly more formal/poetic.",
    examples: [
      { jp: "日本へ行きます。", en: "I'm going to Japan." },
    ],
  },
  {
    particle: "と",
    name: "to (with / and)",
    core: "Together WITH, or AND (exhaustive list).",
    whenUse: "Doing something with someone, or listing nouns.",
    examples: [
      { jp: "友達と映画を見ます。", en: "I'll watch a movie WITH a friend." },
      { jp: "パンとたまごを買いました。", en: "I bought bread AND eggs." },
    ],
  },
  {
    particle: "も",
    name: "mo (also / even)",
    core: "Also / too / even. Replaces は, が, を; stacks with others.",
    whenUse: "Adding on — 'X also does Y', 'even X…'",
    examples: [
      { jp: "私も行きます。", en: "I'll go TOO." },
    ],
  },
];

// ---------- Particle fill-in-the-blank drill ----------
// Each item: sentence with ___ placeholder, correct answer, options array
window.GRAMMAR.particleDrill = [
  { jp: "私___学生です。", answer: "は", options: ["は","が","を","に"], en: "I'm a student.", why: "Topic marker." },
  { jp: "コーヒー___好きです。", answer: "が", options: ["は","が","を","に"], en: "I like coffee.", why: "好き takes が." },
  { jp: "寿司___食べます。", answer: "を", options: ["は","が","を","に"], en: "I eat sushi.", why: "Direct object of 食べる." },
  { jp: "学校___行きます。", answer: "に", options: ["は","が","を","に","で"], en: "I go to school.", why: "Destination → に (also へ works)." },
  { jp: "図書館___勉強します。", answer: "で", options: ["に","で","を","は"], en: "I study at the library.", why: "Location of an ACTION → で." },
  { jp: "猫___います。", answer: "が", options: ["は","が","を","に"], en: "There's a cat.", why: "Existence verb いる → subject marked by が." },
  { jp: "7時___起きます。", answer: "に", options: ["に","で","を","は"], en: "I wake up at 7.", why: "Specific time → に." },
  { jp: "電車___行きます。", answer: "で", options: ["に","で","を","と"], en: "I go by train.", why: "Means of transport → で." },
  { jp: "友達___映画を見ます。", answer: "と", options: ["に","で","と","も"], en: "I watch a movie with a friend.", why: "Together with someone → と." },
  { jp: "公園___います。", answer: "に", options: ["に","で","を","は"], en: "I'm at the park.", why: "Static existence → に (not で)." },
  { jp: "水___飲みます。", answer: "を", options: ["は","が","を","に"], en: "I drink water.", why: "Direct object of 飲む." },
  { jp: "日本___住んでいます。", answer: "に", options: ["に","で","を","は"], en: "I live in Japan.", why: "住む is existence-like → に." },
  { jp: "ペン___書きます。", answer: "で", options: ["に","で","を","と"], en: "I write with a pen.", why: "Tool/means → で." },
  { jp: "私___ケーキが好きです。", answer: "は", options: ["は","が","を","に"], en: "I like cake.", why: "Topic (me) + subject (cake) — 'As for me, cake is liked'." },
  { jp: "映画___好きですか。", answer: "が", options: ["は","が","を","に"], en: "Do you like movies?", why: "好き takes が." },
  { jp: "先生___質問します。", answer: "に", options: ["に","で","を","と"], en: "I ask the teacher a question.", why: "Target of the action → に." },
  { jp: "本___読みます。", answer: "を", options: ["は","が","を","に"], en: "I read a book.", why: "Direct object." },
  { jp: "私___行きます。", answer: "も", options: ["は","が","を","も"], en: "I'll go too.", why: "'Also/too' → も (replaces は)." },
  { jp: "彼___日本人です。", answer: "は", options: ["は","が","を","に"], en: "He is Japanese.", why: "Topic." },
  { jp: "この店___美味しいです。", answer: "は", options: ["は","が","を","に"], en: "This shop is delicious / has good food.", why: "Topic — 'as for this shop…'." },
];

// ---------- Verb conjugation rules ----------
// Categories: u-verb (godan), ru-verb (ichidan), irregular (する、来る)
window.GRAMMAR.verbTypes = {
  u: "う-verb (godan)",
  ru: "る-verb (ichidan)",
  irr: "irregular",
};

// Conjugation engine
window.GRAMMAR.conjugateVerb = function(dict, type, form) {
  // dict = dictionary form in kana (for simplicity, the drill uses kana answers)
  // Special cases
  if (type === "irr") {
    const table = {
      "する": { masu:"します", masuNeg:"しません", past:"した", pastNeg:"しなかった",
                masuPast:"しました", masuPastNeg:"しませんでした", te:"して", nai:"しない",
                potential:"できる", volitional:"しよう" },
      "くる": { masu:"きます", masuNeg:"きません", past:"きた", pastNeg:"こなかった",
                masuPast:"きました", masuPastNeg:"きませんでした", te:"きて", nai:"こない",
                potential:"こられる", volitional:"こよう" },
      "いく": { masu:"いきます", masuNeg:"いきません", past:"いった", pastNeg:"いかなかった",
                masuPast:"いきました", masuPastNeg:"いきませんでした", te:"いって", nai:"いかない",
                potential:"いける", volitional:"いこう" },
    };
    if (table[dict]) return table[dict][form] || null;
  }
  if (type === "ru") {
    const stem = dict.slice(0, -1); // drop る
    const map = {
      masu:           stem + "ます",
      masuNeg:        stem + "ません",
      masuPast:       stem + "ました",
      masuPastNeg:    stem + "ませんでした",
      past:           stem + "た",
      pastNeg:        stem + "なかった",
      te:             stem + "て",
      nai:            stem + "ない",
      potential:      stem + "られる",
      volitional:     stem + "よう",
    };
    return map[form] || null;
  }
  if (type === "u") {
    const last = dict.slice(-1);
    const head = dict.slice(0, -1);
    // i-stem for ます / nai-stem for ない
    const iStem = { "う":"い","つ":"ち","る":"り","む":"み","ぶ":"び","ぬ":"に","く":"き","ぐ":"ぎ","す":"し" }[last];
    const aStem = { "う":"わ","つ":"た","る":"ら","む":"ま","ぶ":"ば","ぬ":"な","く":"か","ぐ":"が","す":"さ" }[last];
    const eStem = { "う":"え","つ":"て","る":"れ","む":"め","ぶ":"べ","ぬ":"ね","く":"け","ぐ":"げ","す":"せ" }[last];
    // te/ta forms depend on ending
    const teEnding = { "う":"って","つ":"って","る":"って",
                       "む":"んで","ぶ":"んで","ぬ":"んで",
                       "く":"いて","ぐ":"いで",
                       "す":"して" }[last];
    const taEnding = { "う":"った","つ":"った","る":"った",
                       "む":"んだ","ぶ":"んだ","ぬ":"んだ",
                       "く":"いた","ぐ":"いだ",
                       "す":"した" }[last];
    if (!iStem) return null;
    const map = {
      masu:           head + iStem + "ます",
      masuNeg:        head + iStem + "ません",
      masuPast:       head + iStem + "ました",
      masuPastNeg:    head + iStem + "ませんでした",
      past:           head + taEnding,
      pastNeg:        head + aStem + "なかった",
      te:             head + teEnding,
      nai:            head + aStem + "ない",
      potential:      head + eStem + "る",
      volitional:     head + eStem + "よう",
    };
    return map[form] || null;
  }
  return null;
};

// Verbs used in conjugation drill (kana only, so the engine works)
window.GRAMMAR.drillVerbs = [
  { dict:"たべる", type:"ru",  en:"eat" },
  { dict:"みる",   type:"ru",  en:"see/watch" },
  { dict:"ねる",   type:"ru",  en:"sleep" },
  { dict:"おきる", type:"ru",  en:"wake up" },
  { dict:"のむ",   type:"u",   en:"drink" },
  { dict:"よむ",   type:"u",   en:"read" },
  { dict:"かく",   type:"u",   en:"write" },
  { dict:"きく",   type:"u",   en:"listen/ask" },
  { dict:"はなす", type:"u",   en:"speak" },
  { dict:"かう",   type:"u",   en:"buy" },
  { dict:"まつ",   type:"u",   en:"wait" },
  { dict:"あそぶ", type:"u",   en:"play" },
  { dict:"およぐ", type:"u",   en:"swim" },
  { dict:"つくる", type:"u",   en:"make" },
  { dict:"かえる", type:"u",   en:"return home (looks ru, is u!)" },
  { dict:"はいる", type:"u",   en:"enter (looks ru, is u!)" },
  { dict:"はしる", type:"u",   en:"run (looks ru, is u!)" },
  { dict:"しる",   type:"u",   en:"know (looks ru, is u!)" },
  { dict:"する",   type:"irr", en:"do" },
  { dict:"くる",   type:"irr", en:"come" },
  { dict:"いく",   type:"irr", en:"go (irregular te-form)" },
];

window.GRAMMAR.verbForms = [
  { key:"masu",        label:"polite (〜ます)" },
  { key:"masuNeg",     label:"polite negative (〜ません)" },
  { key:"masuPast",    label:"polite past (〜ました)" },
  { key:"masuPastNeg", label:"polite past negative (〜ませんでした)" },
  { key:"te",          label:"te-form (〜て)" },
  { key:"nai",         label:"plain negative (〜ない)" },
  { key:"past",        label:"plain past (〜た)" },
  { key:"pastNeg",     label:"plain past negative (〜なかった)" },
  { key:"potential",   label:"potential (can~)" },
  { key:"volitional",  label:"volitional (let's~ / I'll~)" },
];

// ---------- Adjective conjugation ----------
// iAdj: {stem}+い, na-adj: stored without な
window.GRAMMAR.conjugateAdj = function(dict, type, form) {
  if (type === "i") {
    // Handle いい irregular
    let stem;
    if (dict === "いい" || dict === "よい") stem = "よ";
    else stem = dict.slice(0, -1); // drop い
    const map = {
      present:  (dict === "いい" ? "いい" : stem + "い") + "",
      negative: stem + "くない",
      past:     stem + "かった",
      pastNeg:  stem + "くなかった",
      adverb:   stem + "く",
      polite:   (dict === "いい" ? "いい" : stem + "い") + "です",
      politeNeg:stem + "くないです",
      politePast: stem + "かったです",
      politePastNeg: stem + "くなかったです",
      teForm:   stem + "くて",
    };
    return map[form] || null;
  }
  if (type === "na") {
    const stem = dict;
    const map = {
      present:  stem + "だ",
      negative: stem + "じゃない",
      past:     stem + "だった",
      pastNeg:  stem + "じゃなかった",
      adverb:   stem + "に",
      polite:   stem + "です",
      politeNeg:stem + "じゃないです",
      politePast: stem + "でした",
      politePastNeg: stem + "じゃなかったです",
      teForm:   stem + "で",
      beforeNoun: stem + "な〜",
    };
    return map[form] || null;
  }
  return null;
};

window.GRAMMAR.drillAdjectives = [
  { dict:"たかい",     type:"i",  en:"expensive/high" },
  { dict:"やすい",     type:"i",  en:"cheap" },
  { dict:"おおきい",   type:"i",  en:"big" },
  { dict:"ちいさい",   type:"i",  en:"small" },
  { dict:"あたらしい", type:"i",  en:"new" },
  { dict:"ふるい",     type:"i",  en:"old" },
  { dict:"おいしい",   type:"i",  en:"delicious" },
  { dict:"いそがしい", type:"i",  en:"busy" },
  { dict:"おもしろい", type:"i",  en:"interesting/funny" },
  { dict:"むずかしい", type:"i",  en:"difficult" },
  { dict:"あつい",     type:"i",  en:"hot (weather)" },
  { dict:"さむい",     type:"i",  en:"cold (weather)" },
  { dict:"いい",       type:"i",  en:"good (IRREGULAR!)" },

  { dict:"きれい",     type:"na", en:"pretty/clean (na-adj!)" },
  { dict:"げんき",     type:"na", en:"energetic/well" },
  { dict:"しずか",     type:"na", en:"quiet" },
  { dict:"ひま",       type:"na", en:"free (time)" },
  { dict:"たいへん",   type:"na", en:"tough/a lot" },
  { dict:"すき",       type:"na", en:"liked" },
  { dict:"きらい",     type:"na", en:"disliked (na-adj!)" },
  { dict:"ゆうめい",   type:"na", en:"famous" },
  { dict:"べんり",     type:"na", en:"convenient" },
  { dict:"かんたん",   type:"na", en:"simple/easy" },
  { dict:"あんぜん",   type:"na", en:"safe" },
  { dict:"たいせつ",   type:"na", en:"important" },
];

window.GRAMMAR.adjForms = [
  { key:"negative",      label:"plain negative (〜くない / 〜じゃない)" },
  { key:"past",          label:"plain past (〜かった / 〜だった)" },
  { key:"pastNeg",       label:"plain past negative" },
  { key:"polite",        label:"polite (〜です)" },
  { key:"politeNeg",     label:"polite negative" },
  { key:"politePast",    label:"polite past" },
  { key:"politePastNeg", label:"polite past negative" },
  { key:"teForm",        label:"te-form (connector)" },
  { key:"adverb",        label:"adverb (〜く / 〜に)" },
];
