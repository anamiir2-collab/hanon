/* data/animals.js
 * 30+ animals with Arabic + English names. Emojis are used as the primary
 * visual because they are: (1) bundled with the OS so zero network usage,
 * (2) consistent and child-friendly, (3) lightweight. Each animal also has
 * an onomatopoeia sound that the audio manager can synthesize via Web Audio.
 */
window.AT_DATA = window.AT_DATA || {};

window.AT_DATA.animals = [
  { id: "lion",      ar: "أسد",     en: "Lion",      emoji: "🦁", sound: "roar" },
  { id: "cat",       ar: "قطة",     en: "Cat",       emoji: "🐱", sound: "meow" },
  { id: "dog",       ar: "كلب",     en: "Dog",       emoji: "🐶", sound: "woof" },
  { id: "elephant",  ar: "فيل",     en: "Elephant",  emoji: "🐘", sound: "trumpet" },
  { id: "horse",     ar: "حصان",    en: "Horse",     emoji: "🐴", sound: "neigh" },
  { id: "cow",       ar: "بقرة",    en: "Cow",       emoji: "🐮", sound: "moo" },
  { id: "sheep",     ar: "خروف",    en: "Sheep",     emoji: "🐑", sound: "baa" },
  { id: "rabbit",    ar: "أرنب",    en: "Rabbit",    emoji: "🐰", sound: "squeak" },
  { id: "mouse",     ar: "فأر",     en: "Mouse",     emoji: "🐭", sound: "squeak" },
  { id: "chicken",   ar: "دجاجة",   en: "Chicken",   emoji: "🐔", sound: "cluck" },
  { id: "duck",      ar: "بطة",     en: "Duck",      emoji: "🦆", sound: "quack" },
  { id: "fish",      ar: "سمكة",    en: "Fish",      emoji: "🐟", sound: "blub" },
  { id: "monkey",    ar: "قرد",     en: "Monkey",    emoji: "🐵", sound: "ooh" },
  { id: "giraffe",   ar: "زرافة",   en: "Giraffe",   emoji: "🦒", sound: "hum" },
  { id: "tiger",     ar: "نمر",     en: "Tiger",     emoji: "🐯", sound: "roar" },
  { id: "bear",      ar: "دب",      en: "Bear",      emoji: "🐻", sound: "growl" },
  { id: "wolf",      ar: "ذئب",     en: "Wolf",      emoji: "🐺", sound: "howl" },
  { id: "fox",       ar: "ثعلب",    en: "Fox",       emoji: "🦊", sound: "yip" },
  { id: "turtle",    ar: "سلحفاة",  en: "Turtle",    emoji: "🐢", sound: "slow" },
  { id: "frog",      ar: "ضفدع",    en: "Frog",      emoji: "🐸", sound: "ribbit" },
  { id: "butterfly", ar: "فراشة",   en: "Butterfly", emoji: "🦋", sound: "flutter" },
  { id: "bee",       ar: "نحلة",    en: "Bee",       emoji: "🐝", sound: "buzz" },
  { id: "bird",      ar: "عصفور",   en: "Bird",      emoji: "🐦", sound: "tweet" },
  { id: "penguin",   ar: "بطريق",   en: "Penguin",   emoji: "🐧", sound: "squawk" },
  { id: "whale",     ar: "حوت",     en: "Whale",     emoji: "🐋", sound: "song" },
  { id: "dolphin",   ar: "دولفين",  en: "Dolphin",   emoji: "🐬", sound: "click" },
  { id: "crocodile", ar: "تمساح",    en: "Crocodile", emoji: "🐊", sound: "hiss" },
  { id: "panda",     ar: "باندا",    en: "Panda",    emoji: "🐼", sound: "bleat" },
  { id: "camel",     ar: "جمل",     en: "Camel",    emoji: "🐪", sound: "grunt" },
  { id: "zebra",     ar: "حمار وحشي",en: "Zebra",    emoji: "🦓", sound: "bark" },
  { id: "owl",       ar: "بومة",    en: "Owl",       emoji: "🦉", sound: "hoot" },
  { id: "snake",     ar: "ثعبان",   en: "Snake",    emoji: "🐍", sound: "hiss2" },
  { id: "pig",       ar: "خنزير",   en: "Pig",       emoji: "🐷", sound: "oink" }
];
