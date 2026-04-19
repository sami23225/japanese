// ============================================================
// SPEAKING PROMPTS
// Goal: train fluency by FORCING you to answer within N seconds.
// Each prompt shows an English question; you answer aloud in
// Japanese before the timer runs out. A sample answer is shown
// after — don't peek until after you've tried.
// ============================================================

window.SPEAKING = window.SPEAKING || {};

window.SPEAKING.prompts = [
  // --- Self introduction / basics ---
  { prompt: "Introduce yourself (name, where you're from).",
    sample: "私はサミラです。アメリカから来ました。よろしくお願いします。",
    sampleEn: "I'm Samira. I'm from America. Nice to meet you.",
    seconds: 10, tags: ["basics"] },
  { prompt: "Say what you do (student, work, etc.).",
    sample: "私は学生です。英語を勉強しています。",
    sampleEn: "I'm a student. I'm studying English.",
    seconds: 8, tags: ["basics"] },
  { prompt: "Say your age (any age is fine).",
    sample: "二十五歳です。",
    sampleEn: "I'm 25 years old.",
    seconds: 6, tags: ["basics"] },

  // --- Everyday answers ---
  { prompt: "Say what you ate for breakfast today.",
    sample: "今日の朝ご飯はパンとたまごを食べました。",
    sampleEn: "For today's breakfast, I ate bread and eggs.",
    seconds: 10, tags: ["daily","past"] },
  { prompt: "Say what you did yesterday (any activity).",
    sample: "昨日、友達と映画を見ました。",
    sampleEn: "Yesterday I watched a movie with a friend.",
    seconds: 10, tags: ["past"] },
  { prompt: "Say what you're going to do tomorrow.",
    sample: "明日は図書館で勉強します。",
    sampleEn: "Tomorrow I'll study at the library.",
    seconds: 10, tags: ["future","particles"] },
  { prompt: "Say what time you woke up this morning.",
    sample: "今朝、七時に起きました。",
    sampleEn: "I woke up at 7 this morning.",
    seconds: 8, tags: ["time","に"] },
  { prompt: "Say what time you usually go to bed.",
    sample: "たいてい十一時ごろに寝ます。",
    sampleEn: "I usually go to sleep around 11.",
    seconds: 8, tags: ["adverbs","time"] },

  // --- Preferences (practices が) ---
  { prompt: "Say a food you like.",
    sample: "寿司が好きです。",
    sampleEn: "I like sushi.",
    seconds: 6, tags: ["が","preferences"] },
  { prompt: "Say a food you don't like.",
    sample: "納豆があまり好きじゃないです。",
    sampleEn: "I don't really like natto.",
    seconds: 8, tags: ["が","negative"] },
  { prompt: "Say a hobby you enjoy.",
    sample: "音楽を聞くのが好きです。",
    sampleEn: "I like listening to music.",
    seconds: 8, tags: ["が"] },

  // --- Contrast with でも / けど / しかし ---
  { prompt: "Say: \"I'm busy today, but I'm free tomorrow.\"",
    sample: "今日は忙しいです。でも明日は暇です。",
    sampleEn: "I'm busy today. But tomorrow I'm free.",
    seconds: 10, tags: ["contrast","でも"] },
  { prompt: "Say: \"Sushi is delicious but expensive.\"",
    sample: "寿司はおいしいけど、高いです。",
    sampleEn: "Sushi is delicious but expensive.",
    seconds: 10, tags: ["contrast","けど"] },
  { prompt: "Say: \"Japan is beautiful. However, there are many earthquakes.\"",
    sample: "日本は美しい国です。しかし、地震が多いです。",
    sampleEn: "Japan is a beautiful country. However, there are many earthquakes.",
    seconds: 12, tags: ["contrast","しかし"] },

  // --- Particles drills (spoken) ---
  { prompt: "Say: \"I go to school by train.\"",
    sample: "電車で学校に行きます。",
    sampleEn: "I go to school by train.",
    seconds: 10, tags: ["に","で"] },
  { prompt: "Say: \"I study Japanese at home.\"",
    sample: "家で日本語を勉強します。",
    sampleEn: "I study Japanese at home.",
    seconds: 10, tags: ["で"] },
  { prompt: "Say: \"I eat dinner with my family.\"",
    sample: "家族と晩ご飯を食べます。",
    sampleEn: "I eat dinner with my family.",
    seconds: 10, tags: ["と"] },

  // --- Conjugation practice (past / negative) ---
  { prompt: "Say: \"I didn't go to work yesterday.\"",
    sample: "昨日、仕事に行きませんでした。",
    sampleEn: "I didn't go to work yesterday.",
    seconds: 10, tags: ["past-neg"] },
  { prompt: "Say: \"I can speak a little Japanese.\"",
    sample: "日本語が少し話せます。",
    sampleEn: "I can speak a little Japanese.",
    seconds: 10, tags: ["potential"] },
  { prompt: "Say: \"Let's eat ramen together.\"",
    sample: "一緒にラーメンを食べましょう。",
    sampleEn: "Let's eat ramen together.",
    seconds: 8, tags: ["invitation"] },

  // --- Short-form casual ---
  { prompt: "Casually say: \"I don't know.\"",
    sample: "わからない。",
    sampleEn: "I don't know. (casual)",
    seconds: 5, tags: ["casual"] },
  { prompt: "Casually say: \"I'm going home.\"",
    sample: "家に帰る。",
    sampleEn: "I'm going home. (casual)",
    seconds: 6, tags: ["casual"] },

  // --- Small talk (fluency) ---
  { prompt: "React to someone saying it's cold. (use そうそう、たしかに、or でも)",
    sample: "そうそう、今日はすごく寒いですね。",
    sampleEn: "Yeah, yeah — it's really cold today, huh.",
    seconds: 8, tags: ["fillers","small-talk"] },
  { prompt: "Hesitate and then answer where you're from.",
    sample: "えっと…アメリカのシカゴから来ました。",
    sampleEn: "Uhh… I'm from Chicago in America.",
    seconds: 10, tags: ["fillers"] },
  { prompt: "Order a coffee at a cafe (polite).",
    sample: "すみません、コーヒーを一つお願いします。",
    sampleEn: "Excuse me, one coffee please.",
    seconds: 8, tags: ["polite"] },
  { prompt: "Ask someone if they like Japanese food.",
    sample: "日本料理が好きですか。",
    sampleEn: "Do you like Japanese food?",
    seconds: 8, tags: ["questions","が"] },

  // --- Describing ---
  { prompt: "Describe your best friend (two adjectives).",
    sample: "私の親友は優しくて、面白い人です。",
    sampleEn: "My best friend is kind and interesting.",
    seconds: 12, tags: ["adj","te-form"] },
  { prompt: "Describe today's weather.",
    sample: "今日は晴れで、暖かいです。",
    sampleEn: "Today it's sunny and warm.",
    seconds: 10, tags: ["adj","na-te"] },

  // --- Asking ---
  { prompt: "Ask: \"What time is it?\"",
    sample: "今何時ですか。",
    sampleEn: "What time is it now?",
    seconds: 5, tags: ["questions"] },
  { prompt: "Ask: \"Where is the station?\"",
    sample: "駅はどこですか。",
    sampleEn: "Where is the station?",
    seconds: 5, tags: ["questions"] },
  { prompt: "Ask a friend: \"Wanna go out this weekend?\"",
    sample: "今週末、遊びに行かない？",
    sampleEn: "Wanna go hang out this weekend?",
    seconds: 10, tags: ["invitation","casual"] },
];

// Tips shown on the speaking tab to reduce second-guessing
window.SPEAKING.tips = [
  "Answer before you're 'ready'. Fluency = output under pressure, not perfect output.",
  "Use a filler when stuck: えっと…、あのう…、なんか… They buy thinking time AND sound natural.",
  "Wrong particle? Keep going. Self-correct with ていうか or just push through.",
  "Say the same sentence 3 times — first slow, then faster, then natural speed.",
  "If the timer runs out, try again. The point is reps.",
];
