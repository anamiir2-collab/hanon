/* data/games.js
 * 5 quiz games, each with multiple questions generated from the datasets.
 * Question types:
 *   1. pickAnimal  — "أين القطة؟" show 3 animal emojis
 *   2. pickNumber — show N items, ask "كم تفاحة؟" 3 numeric options
 *   3. pickLetter  — show image, ask "بأي حرف تبدأ؟" 3 letter options
 *   4. pickColor   — show colored ball, ask "ما لون الكرة؟" 3 color options
 *   5. pickAnimalBySound — play animal sound, ask "ما الحيوان؟" 3 options
 *
 * Question sets are generated dynamically by components/quiz.js so that
 * adding data automatically extends the question pool. The metadata here
 * describes game metadata + minimum question counts.
 */
window.AT_DATA = window.AT_DATA || {};

window.AT_DATA.games = [
  {
    id: "pickAnimal",
    type: "pickAnimal",
    ar: "اختر الحيوان",
    en: "Pick the Animal",
    icon: "🐾",
    color: "#FFB74D",
    minQuestions: 10
  },
  {
    id: "pickNumber",
    type: "pickNumber",
    ar: "اختر الرقم",
    en: "Pick the Number",
    icon: "🔢",
    color: "#64B5F6",
    minQuestions: 10
  },
  {
    id: "pickLetter",
    type: "pickLetter",
    ar: "اختر الحرف",
    en: "Pick the Letter",
    icon: "🔤",
    color: "#81C784",
    minQuestions: 10
  },
  {
    id: "pickColor",
    type: "pickColor",
    ar: "اختر اللون",
    en: "Pick the Color",
    icon: "🎨",
    color: "#BA68C8",
    minQuestions: 10
  },
  {
    id: "pickAnimalSound",
    type: "pickAnimalBySound",
    ar: "مين الحيوان؟",
    en: "Who is it?",
    icon: "🔊",
    color: "#4DB6AC",
    minQuestions: 10
  }
];

// Praise phrases shown after a correct answer (gentle, non-competitive).
window.AT_DATA.praise = [
  "برافو!",
  "ممتاز!",
  "أحسنت!",
  "شاطر!",
  "رائع!",
  "أنت بطل!",
  "تمام!"
];

// Gentle retry phrases shown after a wrong answer (no shame, no point loss).
window.AT_DATA.retry = [
  "جرب تاني",
  "قربت!",
  "تعالى نحاول مرة تانية",
  "لا بأس، حاول مرة أخرى"
];
