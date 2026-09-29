/**
 * menu-data.js
 * Mock/placeholder menu data. Replace MENU_ITEMS with a real API call
 * (e.g. fetch('/api/menu')) once the backend is ready — the rest of the
 * front end already reads from this same shape.
 */

const MENU_ITEMS = [
  {
    id: "cafe-latte",
    name: "Cafe Latte",
    category: "coffee",
    description: "Rich espresso with steamed milk. Smooth and balanced.",
    priceMin: 148,
    priceMax: 168,
    thumbGradient: "linear-gradient(135deg,#caa26a,#8a5a2b)",
    featured: true
  },
  {
    id: "vanilla-latte",
    name: "Vanilla Latte",
    category: "coffee",
    description: "Classic espresso, fresh milk, and sweet vanilla syrup.",
    priceMin: 148,
    priceMax: 168,
    thumbGradient: "linear-gradient(135deg,#b5824a,#6b3f1d)",
    featured: true
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "coffee",
    description: "Bold espresso, rich chocolate, and velvety milk.",
    priceMin: 158,
    priceMax: 178,
    thumbGradient: "linear-gradient(135deg,#8a4a2b,#3d2213)",
    featured: true
  },
  {
    id: "spanish-latte",
    name: "Spanish Latte",
    category: "coffee",
    description: "Espresso and fresh milk sweetened with condensed milk.",
    priceMin: 158,
    priceMax: 178,
    thumbGradient: "linear-gradient(135deg,#d9b98a,#8a5a2b)",
    featured: false
  },
  {
    id: "biscoff",
    name: "Biscoff",
    category: "coffee",
    description: "Espresso and milk infused with spiced Biscoff cookie spread.",
    priceMin: 158,
    priceMax: 178,
    thumbGradient: "linear-gradient(135deg,#d4a24a,#7a4a1e)",
    featured: false
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "non-coffee",
    description: "Stone-ground matcha whisked with fresh, creamy milk.",
    priceMin: 148,
    priceMax: 168,
    thumbGradient: "linear-gradient(135deg,#a9c78a,#4c6b32)",
    featured: false
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    category: "non-coffee",
    description: "Fresh milk blended with sweet strawberry puree.",
    priceMin: 138,
    priceMax: 158,
    thumbGradient: "linear-gradient(135deg,#f2a6ad,#c94f5c)",
    featured: false
  },
  {
    id: "sisig-rice-bowl",
    name: "Sisig Rice Bowl",
    category: "food",
    description: "Sizzling pork sisig served over garlic rice.",
    priceMin: 158,
    priceMax: 158,
    thumbGradient: "linear-gradient(135deg,#c98a4a,#7a4520)",
    featured: false
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    category: "food",
    description: "Triple-decker with egg, ham, and cheese.",
    priceMin: 168,
    priceMax: 168,
    thumbGradient: "linear-gradient(135deg,#e0c48a,#a47a3a)",
    featured: false
  },
  {
    id: "basque-burnt-cheesecake",
    name: "Basque Burnt Cheesecake",
    category: "pastries",
    description: "Creamy, caramelized-top cheesecake slice.",
    priceMin: 128,
    priceMax: 128,
    thumbGradient: "linear-gradient(135deg,#e8c98a,#a1722f)",
    featured: false
  },
  {
    id: "choco-croissant",
    name: "Chocolate Croissant",
    category: "pastries",
    description: "Buttery, flaky croissant filled with dark chocolate.",
    priceMin: 98,
    priceMax: 98,
    thumbGradient: "linear-gradient(135deg,#8a5a2b,#3d2213)",
    featured: false
  }
];

// Shared customization options for drinks (Coffee + Non-Coffee items).
// Food and Pastries skip customization and just get a quantity stepper.
const ICE_LEVELS = ["No Ice", "Less Ice", "Normal Ice", "Extra Ice"];
const SUGAR_LEVELS = ["0%", "25%", "50%", "75%", "100%"];
const ADDONS = [
  { id: "espresso-shot", label: "Extra Espresso Shot", price: 20 },
  { id: "syrup", label: "Vanilla / Caramel / Hazelnut Syrup", price: 15 },
  { id: "whipped-cream", label: "Whipped Cream", price: 15 }
];

function isCustomizable(item) {
  return item.category === "coffee" || item.category === "non-coffee";
}

// Derives the two selectable sizes (16oz / 22oz) from an item's
// existing priceMin/priceMax so menu-data.js stays the single source
// of truth for pricing.
function getSizes(item) {
  return [
    { label: "16 oz", price: item.priceMin },
    { label: "22 oz", price: item.priceMax }
  ];
}

const CATEGORIES = [
  { id: "all", label: "All", icon: "🍽" },
  { id: "coffee", label: "Coffee", icon: "☕" },
  { id: "non-coffee", label: "Non-Coffee", icon: "🥤" },
  { id: "food", label: "Food", icon: "🍴" },
  { id: "pastries", label: "Pastries", icon: "🥐" }
];

function formatPrice(item) {
  return item.priceMin === item.priceMax
    ? `₱${item.priceMin}`
    : `₱${item.priceMin} - ${item.priceMax}`;
}
