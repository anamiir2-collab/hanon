/* js/i18n.js
 * Centralized bilingual string registry. The whole UI pulls strings from
 * here — no inline Arabic/English literals scattered across components.
 *
 * Direction is also controlled here: Arabic = RTL, English = LTR.
 */
(function (global) {
  "use strict";

  var STRINGS = {
    appName:       { ar: "أتعلم وألعب",   en: "Learn & Play" },
    appTagline:    { ar: "نتعلم ونلعب كل يوم", en: "We learn and play every day" },
    welcome:       { ar: "أهلاً بيك!",     en: "Welcome!" },

    // Home section titles
    sec_numbers:   { ar: "الأرقام",        en: "Numbers" },
    sec_ar_letters:{ ar: "الحروف العربية",  en: "Arabic Letters" },
    sec_en_letters:{ ar: "الحروف الإنجليزية",en: "English Letters" },
    sec_animals:   { ar: "الحيوانات",       en: "Animals" },
    sec_colors:     { ar: "الألوان",        en: "Colors" },
    sec_shapes:    { ar: "الأشكال",        en: "Shapes" },
    sec_words:     { ar: "كلماتي الأولى",   en: "First Words" },
    sec_games:     { ar: "الألعاب",        en: "Games" },
    sec_progress:  { ar: "إنجازاتي",        en: "My Achievements" },

    // Generic UI
    listen:        { ar: "اسمع",          en: "Listen" },
    animalSound:   { ar: "صوت الحيوان",   en: "Animal Sound" },
    next:          { ar: "التالي",        en: "Next" },
    back:          { ar: "رجوع",          en: "Back" },
    previous:      { ar: "السابق",        en: "Previous" },
    home:          { ar: "الرئيسية",      en: "Home" },
    retry:         { ar: "حاول تاني",     en: "Try again" },
    parent:        { ar: "منطقة الوالدين",  en: "Parent Area" },
    close:         { ar: "إغلاق",         en: "Close" },

    // Lesson chrome
    lessonOf:      { ar: "درس",            en: "Lesson" },
    ofTotal:       { ar: "من",            en: "of" },

    // Parent area
    parentGate:    { ar: "للدخول للوالدين، حُل المسألة:", en: "To enter Parent Area, solve:" },
    parentWrong:   { ar: "إجابة غير صحيحة", en: "Incorrect answer" },
    childLevel:    { ar: "مستوى الطفل",     en: "Child Level" },
    childProgress: { ar: "تقدم الطفل",      en: "Child Progress" },
    lessonsDone:   { ar: "دروس مكتملة",     en: "Lessons Done" },
    correctAnswers:{ ar: "إجابات صحيحة",    en: "Correct Answers" },
    timeUsed:      { ar: "الوقت المستخدم",   en: "Time Used" },
    soundOn:       { ar: "الصوت",          en: "Sound" },
    language:      { ar: "اللغة",          en: "Language" },
    theme:         { ar: "الوضع",          en: "Theme" },
    lightMode:     { ar: "نهاري",          en: "Light" },
    darkMode:      { ar: "ليلي",           en: "Dark" },
    resetProgress: { ar: "إعادة التقدم",    en: "Reset Progress" },
    confirmReset:  { ar: "هل تريد فعلًا مسح كل التقدم؟", en: "Really reset all progress?" },

    // Progress page
    stars:         { ar: "نجوم",           en: "Stars" },
    achievements:  { ar: "الإنجازات",       en: "Achievements" },
    ach_firstLesson:    { ar: "أول درس",          en: "First Lesson" },
    ach_fiveCorrect:    { ar: "أول 5 إجابات صحيحة", en: "5 Correct Answers" },
    ach_fiveLetters:    { ar: "تعلمت 5 حروف",     en: "Learned 5 Letters" },
    ach_tenNumbers:     { ar: "تعلمت 10 أرقام",   en: "Learned 10 Numbers" },
    ach_tenAnimals:     { ar: "تعلمت 10 حيوانات", en: "Learned 10 Animals" },
    ach_finishLetters:  { ar: "أكملت الحروف",     en: "Finished All Letters" },
    ach_stars50:        { ar: "وصلت لـ 50 نجمة",  en: "Reached 50 Stars" },

    // Game prompts
    whereIs:       { ar: "أين",            en: "Where is" },
    howMany:       { ar: "كم",            en: "How many" },
    whichLetter:   { ar: "بأي حرف تبدأ",  en: "Which letter does it start with?" },
    whatColor:     { ar: "ما لون",        en: "What color is" },
    whoSound:      { ar: "من هذا الصوت؟", en: "Whose sound is this?" },
    question:      { ar: "سؤال",          en: "Question" },
    score:         { ar: "النتيجة",       en: "Score" },

    // Games hub
    pickGame:      { ar: "اختر لعبة",      en: "Pick a Game" },
    startGame:     { ar: "ابدأ",          en: "Start" },

    // Splash
    loading:      { ar: "جاري التحميل...", en: "Loading..." },

    // Levels
    level_1: { ar: "مستوى 1 (2-3 سنوات)", en: "Level 1 (2-3 years)" },
    level_2: { ar: "مستوى 2 (3-4 سنوات)", en: "Level 2 (3-4 years)" },
    level_3: { ar: "مستوى 3 (4-5 سنوات)", en: "Level 3 (4-5 years)" },
    level_4: { ar: "مستوى 4 (5-6 سنوات)", en: "Level 4 (5-6 years)" }
  };

  var LANG = "ar";

  var I18n = {
    setLang: function (lang) {
      LANG = (lang === "en") ? "en" : "ar";
      var dir = (LANG === "ar") ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", LANG);
      document.documentElement.setAttribute("dir", dir);
      document.body.setAttribute("dir", dir);
    },
    getLang: function () { return LANG; },
    isRtl: function () { return LANG === "ar"; },
    t: function (key) {
      var entry = STRINGS[key];
      if (!entry) return key;
      return entry[LANG] || entry.ar || key;
    }
  };

  global.I18n = I18n;
})(window);
