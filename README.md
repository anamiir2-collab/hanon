# أتعلم وألعب — Learn & Play 👧👦

تطبيق تعليمي تفاعلي للأطفال من عمر سنتين فما فوق. يعمل على الهاتف والتابلت، **Mobile First** و **PWA** — قابل للتثبيت ويعمل بدون إنترنت. مكتوب بـ **Vanilla HTML/CSS/JavaScript** فقط، بدون أي Frameworks ثقيلة.

---

## ✨ المميزات

- **7 أقسام تعليمية**: الأرقام (عربي/إنجليزي)، الحروف العربية، الحروف الإنجليزية، الحيوانات، الألوان، الأشكال، الكلمات الأولى.
- **5 ألعاب تعليمية**: اختر الحيوان، اختر الرقم، اختر الحرف، اختر اللون، مين الحيوان من الصوت.
- **نظام نجوم وإنجازات** بدون ضغط تنافسي على الطفل.
- **نطق تلقائي** عبر Web Speech API بالعربية والإنجليزية، مع توليد أصوات الحيوانات عبر Web Audio API.
- **دعم RTL/LTR** كامل مع تبديل فوري بين العربية والإنجليزية.
- **وضع نهاري/ليلي** اختياري.
- **منطقة الوالدين** محمية بسؤال رياضي بسيط لمنع دخول الطفل.
- **PWA كامل**: قابل للتثبيت، يعمل أوفلاين، له splash screen وأيقونات.
- **آمن تمامًا**: لا تسجيل دخول، لا إعلانات، لا تتبع، لا جمع بيانات، كل البيانات محفوظة محليًا على جهاز الطفل فقط.

---

## 📁 هيكل الملفات

```
atallam-walab/
├── index.html              ← الصفحة الرئيسية + تحميل كل السكربتات
├── style.css               ← كل الأنماط (Mobile First + RTL/LTR + Dark)
├── manifest.json            ← PWA manifest
├── sw.js                    ← Service Worker (offline + caching)
├── README.md
├── .gitignore
│
├── js/                     ← وحدات JavaScript المنطقية
│   ├── app.js              ← تهيئة التطبيق + top chrome + splash
│   ├── router.js           ← توجيه SPA بالـ hash
│   ├── audio.js            ← مدير الصوت المركزي + توليد أصوات الحيوانات
│   ├── speech.js           ← Web Speech API (TTS)
│   ├── storage.js          ← LocalStorage (تفضيلات + تقدم)
│   ├── i18n.js             ← نظام الترجمة (ar/en)
│   ├── progress.js         ← النجوم + الإنجازات
│   ├── games.js            ← مولّد أسئلة الألعاب
│   └── parent.js           ← منطقة الوالدين + بوابة رياضية
│
├── components/             ← الواجهات (views)
│   ├── home.js             ← الشاشة الرئيسية
│   ├── lesson.js           ← عارض الدرس العام (لـ 6 أنواع)
│   ├── quiz.js             ← الألعاب + hub الألعاب
│   └── progress.js         ← صفحة الإنجازات
│
├── data/                   ← بيانات المحتوى (Data-Driven)
│   ├── arabic-letters.js   ← 28 حرفًا
│   ├── english-letters.js  ← 26 حرفًا
│   ├── arabic-numbers.js   ← ١–٢٠
│   ├── english-numbers.js  ← 1–20
│   ├── animals.js          ← 33 حيوانًا
│   ├── colors.js           ← 10 ألوان
│   ├── shapes.js           ← 7 أشكال (SVG inline)
│   ├── words.js            ← 22 كلمة أولى
│   └── games.js            ← بيانات الألعاب + عبارات التشجيع
│
└── assets/
    └── icons/               ← أيقونات PWA (192, 512, maskable, favicon)
```

---

## 🚀 التشغيل محليًا

بما أن التطبيق يستخدم Service Worker و ES modules عبر `<script src>`، يفضّل تشغيل خادم محلي بدل فتح الملف مباشرة:

```bash
# الخيار 1: Python
cd atallam-walab
python3 -m http.server 8080
# ثم افتح: http://localhost:8080

# الخيار 2: Node
npx serve .

# الخيار 3: VS Code
# ثبّت إضافة "Live Server" ثم اضغط "Go Live"
```

---

## ☁️ الرفع على GitHub Pages

1. أنشئ مستودعًا جديدًا على GitHub (مثلًا `atallam-walab`).
2. ارفع كل محتويات مجلد `atallam-walab/` إلى جذر المستودع:
   ```bash
   cd atallam-walab
   git init
   git add .
   git commit -m "Initial commit: Atallam Walab kids app"
   git branch -M main
   git remote add origin https://github.com/USERNAME/atallam-walab.git
   git push -u origin main
   ```
3. من إعدادات المستودع: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
4. انتظر دقيقة — سيكون التطبيق متاحًا على:
   `https://USERNAME.github.io/atallam-walab/`

> ✅ كل المسارات في الكود نسبية (`./assets/...`) لذا يعمل على GitHub Pages سواء كان في جذر النطاق أو في مسار فرعي.

---

## ➕ كيف أضيف محتوى جديدًا؟

كل المحتوى **Data-Driven**. كل الإضافات تتم بإضافة Object واحد فقط، بدون لمس HTML.

### إضافة حرف عربي جديد
افتح `data/arabic-letters.js` وأضف:
```js
{ id: "unique-id", letter: "ح", word: "كلمة", wordEn: "Word", emoji: "🍎" }
```

### إضافة حرف إنجليزي جديد
افتح `data/english-letters.js` وأضف:
```js
{ id: "x", letter: "X", word: "Word", wordAr: "كلمة", emoji: "🍎" }
```

### إضافة حيوان جديد
افتح `data/animals.js` وأضف:
```js
{ id: "fox", ar: "ثعلب", en: "Fox", emoji: "🦊", sound: "yip" }
```
> أسماء الأصوات المدعومة موجودة في `js/audio.js` تحت `ANIMAL_SOUND_PRESETS`. لإضافة صوت جديد، أضف preset جديد هناك.

### إضافة لون جديد
افتح `data/colors.js`:
```js
{ id: "cyan", ar: "سماوي", en: "Cyan", hex: "#00BCD4" }
```

### إضافة شكل جديد
افتح `data/shapes.js`. الشكل يُرسم بـ SVG inline:
```js
{ id: "diamond", ar: "معين", en: "Diamond",
  svg: '<polygon points="50,5 95,50 50,95 5,50" />' }
```

### إضافة كلمة جديدة
افتح `data/words.js`:
```js
{ id: "tree", ar: "شجرة", en: "Tree", emoji: "🌳" }
```

### إضافة سؤال جديد للألعاب
الأسئلة **تُولَّد تلقائيًا** من البيانات الموجودة في `js/games.js` — لذا إضافة أي عنصر للبيانات (حيوان، حرف، رقم، لون) يضيف تلقائيًا أسئلة جديدة للعبة المناسبة. لا حاجة لتعديل كود اللعبة.

### إضافة صورة
التطبيق يستخدم **emoji** و **SVG inline** كافتراضي لتجنب التبعيات الخارجية. لاستبدال أي عنصر بصورة فعلية:
1. ضع الصورة بتنسيق WebP في `assets/images/<category>/`.
2. أضف حقل `image: "./assets/images/animals/lion.webp"` للعنصر في ملف البيانات.
3. عدّل `components/lesson.js` دالة `renderVisual` لتفضّل `item.image` إن وُجد.

### إضافة صوت محلي (mp3)
1. ضع الملف في `assets/audio/ar/` أو `assets/audio/en/`.
2. أضف حقل `audio: "./assets/audio/ar/alef.mp3"` للعنصر.
3. `js/audio.js` جاهز لدعم هذا في المستقبل — استدعِ `playAudio(path)` بدل `speakArabic(text)` إن وُجد الملف.

### إضافة لغة جديدة
1. افتح `js/i18n.js` وأضف ترجمة لكل مفتاح في `STRINGS` باللغة الجديدة.
2. عدّل دالة `setLang` لدعم اللغة الجديدة واختيار الاتجاه (RTL/LTR).
3. أضف خيار الراديو في `js/parent.js` منطقة الوالدين.

---

## 🎨 مبادئ التصميم

- **بطاقات كبيرة مستديرة** قابلة للضغط بأصابع الأطفال الصغيرة (≥56px).
- **انتقالات ناعمة** بدون وميض أو اهتزاز مزعج.
- **ألوان دافئة** ومرحة بدون أن تكون فاقعة.
- **التكرار** و**التشجيع** بدل المنافسة.
- **عدم خصم النقاط** على الإجابات الخاطئة (يومئز بلطف: "جرب تاني").
- **احترام `prefers-reduced-motion`** لإيقاف الحركات لمن يحتاج.

---

## 🔒 الخصوصية والأمان

- لا تسجيل دخول. لا إعلانات. لا تتبع. لا تحليلات.
- لا تُرسل أي بيانات إلى أي خادم.
- كل البيانات (اللغة، المستوى، النجوم، الإنجازات) محفوظة في `localStorage` فقط على جهاز الطفل.
- لا يُستخدم `eval()` ولا `innerHTML` مع بيانات غير موثوقة.
- منطقة الوالدين محمية بسؤال رياضي بسيط لمنع وصول الطفل العرضي.

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|----------|
| HTML5 | البنية |
| CSS3 (custom properties, grid, env()) | التصميم + الوضع الليلي + safe-area |
| Vanilla JavaScript (ES5-safe) | كل المنطق |
| Web Speech API | النطق بالعربية والإنجليزية |
| Web Audio API | توليد أصوات الحيوانات والمؤثرات |
| LocalStorage | حفظ التفضيلات والتقدم |
| Service Worker | Offline + caching |
| Web App Manifest | تثبيت PWA |

---

## 📜 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام التعليمي الحر.
