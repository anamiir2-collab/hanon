/* data/shapes.js
 * 7 shapes. Each shape has an SVG path that components/lesson.js renders
 * directly — no image files needed.
 */
window.AT_DATA = window.AT_DATA || {};

window.AT_DATA.shapes = [
  {
    id: "circle",
    ar: "دائرة",
    en: "Circle",
    svg: '<circle cx="50" cy="50" r="42" />'
  },
  {
    id: "square",
    ar: "مربع",
    en: "Square",
    svg: '<rect x="10" y="10" width="80" height="80" rx="6" />'
  },
  {
    id: "triangle",
    ar: "مثلث",
    en: "Triangle",
    svg: '<polygon points="50,8 92,88 8,88" />'
  },
  {
    id: "rectangle",
    ar: "مستطيل",
    en: "Rectangle",
    svg: '<rect x="6" y="25" width="88" height="50" rx="6" />'
  },
  {
    id: "star",
    ar: "نجمة",
    en: "Star",
    svg: '<polygon points="50,5 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" />'
  },
  {
    id: "heart",
    ar: "قلب",
    en: "Heart",
    svg: '<path d="M50 88 C 18 65, 8 42, 24 28 C 38 16, 50 30, 50 38 C 50 30, 62 16, 76 28 C 92 42, 82 65, 50 88 Z" />'
  },
  {
    id: "oval",
    ar: "بيضاوي",
    en: "Oval",
    svg: '<ellipse cx="50" cy="50" rx="44" ry="30" />'
  }
];
