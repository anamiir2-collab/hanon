/* data/arabic-letters.js
 * الحروف العربية - Arabic letters dataset.
 * Each letter has an SVG emoji-free illustration rendered from a simple
 * shape (see components/lesson.js) and a spoken word. No external image
 * files are required — keeps the app offline-first and lightweight.
 */
window.AT_DATA = window.AT_DATA || {};

window.AT_DATA.arabicLetters = [
  { id: "alef",     letter: "أ", word: "أسد",   wordEn: "Lion",     emoji: "🦁" },
  { id: "ba",       letter: "ب", word: "بطة",   wordEn: "Duck",     emoji: "🦆" },
  { id: "ta",       letter: "ت", word: "تفاحة", wordEn: "Apple",    emoji: "🍎" },
  { id: "tha",      letter: "ث", word: "ثعلب",  wordEn: "Fox",      emoji: "🦊" },
  { id: "jeem",     letter: "ج", word: "جمل",   wordEn: "Camel",    emoji: "🐪" },
  { id: "ha",       letter: "ح", word: "حصان",  wordEn: "Horse",    emoji: "🐴" },
  { id: "kha",      letter: "خ", word: "خروف",  wordEn: "Sheep",    emoji: "🐑" },
  { id: "dal",      letter: "د", word: "دب",    wordEn: "Bear",     emoji: "🐻" },
  { id: "thal",     letter: "ذ", word: "ذرة",   wordEn: "Corn",     emoji: "🌽" },
  { id: "ra",       letter: "ر", word: "أرنب",  wordEn: "Rabbit",   emoji: "🐰" },
  { id: "zay",      letter: "ز", word: "زرافة", wordEn: "Giraffe",  emoji: "🦒" },
  { id: "seen",     letter: "س", word: "سمكة",  wordEn: "Fish",     emoji: "🐟" },
  { id: "sheen",    letter: "ش", word: "شمس",   wordEn: "Sun",      emoji: "☀️" },
  { id: "sad",      letter: "ص", word: "صقر",   wordEn: "Falcon",   emoji: "🦅" },
  { id: "dad",      letter: "ض", word: "ضفدع",  wordEn: "Frog",     emoji: "🐸" },
  { id: "ta2",      letter: "ط", word: "طائرة", wordEn: "Airplane", emoji: "✈️" },
  { id: "za2",      letter: "ظ", word: "ظبي",   wordEn: "Gazelle",  emoji: "🦌" },
  { id: "ain",      letter: "ع", word: "عصفور", wordEn: "Bird",     emoji: "🐦" },
  { id: "ghain",    letter: "غ", word: "غزال",  wordEn: "Deer",     emoji: "🦌" },
  { id: "fa",       letter: "ف", word: "فيل",   wordEn: "Elephant", emoji: "🐘" },
  { id: "qaf",      letter: "ق", word: "قطة",   wordEn: "Cat",      emoji: "🐱" },
  { id: "kaf",      letter: "ك", word: "كتاب",  wordEn: "Book",     emoji: "📚" },
  { id: "lam",      letter: "ل", word: "ليمون", wordEn: "Lemon",    emoji: "🍋" },
  { id: "meem",     letter: "م", word: "موز",   wordEn: "Banana",   emoji: "🍌" },
  { id: "noon",     letter: "ن", word: "نحلة",  wordEn: "Bee",      emoji: "🐝" },
  { id: "ha2",      letter: "ه", word: "هدية",  wordEn: "Gift",     emoji: "🎁" },
  { id: "waw",      letter: "و", word: "وردة",  wordEn: "Rose",     emoji: "🌹" },
  { id: "ya",       letter: "ي", word: "يد",    wordEn: "Hand",     emoji: "✋" }
];
