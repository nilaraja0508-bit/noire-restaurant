// =========================================================
// NOIRÉ — Menu data
// Kept separate from rendering logic so cards stay reusable
// and filtering/rendering never needs hardcoded markup.
// =========================================================

export const CATEGORY_LABELS = {
  'all': 'All',
  'small-chaos': 'Small Chaos',
  'handheld': 'Handheld',
  'main-character': 'Main Character',
  'sweet-tooth': 'Sweet Tooth',
  'liquid-courage': 'Liquid Courage',
};

// Shown under the filter bar so guests know what a category
// actually means before they tap into it.
export const CATEGORY_DESCRIPTIONS = {
  'all': 'Everything on the table — small bites, big mains, and everything in between.',
  'small-chaos': 'Mini bites and appetizers built to be fought over.',
  'handheld': 'Burgers, tacos and melts — no cutlery required.',
  'main-character': 'The mains. Bold, layered, and impossible to ignore.',
  'sweet-tooth': 'Desserts for the ones who always have room for one more bite.',
  'liquid-courage': 'Drinks to loosen up and lean into the chaos.',
};

export const MENU_ITEMS = [
  // ---- Small Chaos ----
  {
    id: 'butter-chicken-bao',
    name: 'Butter Chicken Bao',
    price: 349,
    category: 'small-chaos',
    description: 'One bite and it’s gone — pillow-soft, dripping with smoky richness that makes you reach for a second before you’ve finished the first.',
    tint: 'var(--peach)',
  },
  {
    id: 'tandoori-corn-ribs',
    name: 'Tandoori Corn Ribs',
    price: 249,
    category: 'small-chaos',
    description: 'Charred, buttery, faintly sweet — the kind of smell that pulls you across the room before you’ve even sat down.',
    tint: 'var(--peach)',
  },
  {
    id: 'paneer-firecracker',
    name: 'Paneer Firecracker',
    price: 299,
    category: 'small-chaos',
    description: 'That first crackle of crisp giving way to glaze — sticky, spicy, gone in three bites and worth every one.',
    tint: 'var(--peach)',
  },

  // ---- Handheld ----
  {
    id: 'butter-chicken-smash',
    name: 'Butter Chicken Smash',
    price: 429,
    category: 'handheld',
    description: 'Messy in the best way — molten cheese pulling apart, sauce dripping down your fingers, the kind of bite you close your eyes for.',
    tint: 'var(--lavender)',
  },
  {
    id: 'achari-chicken-tacos',
    name: 'Achari Chicken Tacos',
    price: 379,
    category: 'handheld',
    description: 'Sharp, tangy, addictive — the kind of heat that makes you chase it with the very next bite instead of a drink.',
    tint: 'var(--lavender)',
  },
  {
    id: 'the-paneer-melt',
    name: 'The Paneer Melt',
    price: 369,
    category: 'handheld',
    description: 'Golden, crisp-edged and impossibly gooey inside — comfort food that hits like a warm hug with a chilli kick.',
    tint: 'var(--lavender)',
  },

  // ---- Main Character ----
  {
    id: 'masala-miso-ramen',
    name: 'Masala Miso Ramen',
    price: 449,
    category: 'main-character',
    description: 'Steam curling off the bowl, broth so rich it coats the spoon — one sip and the whole table goes quiet.',
    tint: 'var(--lime)',
  },
  {
    id: 'tandoori-udon',
    name: 'Tandoori Udon',
    price: 429,
    category: 'main-character',
    description: 'Chewy, smoky, slicked in a sauce that clings to every noodle — the kind of plate you scrape clean without meaning to.',
    tint: 'var(--lime)',
  },
  {
    id: 'butter-chicken-lasagna',
    name: 'Butter Chicken Lasagna',
    price: 499,
    category: 'main-character',
    description: 'The bite that collapses the second your fork lands — molten layers, smoky heat, and a finish that lingers long after the plate’s empty.',
    tint: 'var(--lime)',
    badge: 'NOIRÉ Signature',
    signature: true,
  },

  // ---- Sweet Tooth ----
  {
    id: 'gulab-jamun-cheesecake',
    name: 'Gulab Jamun Cheesecake',
    price: 329,
    category: 'sweet-tooth',
    description: 'Cool, dense, syrup-soaked warmth folded in — the collision of two desserts you didn’t know you were craving until now.',
    tint: 'var(--peach)',
  },
  {
    id: 'miso-caramel-brownie',
    name: 'Miso Caramel Brownie',
    price: 299,
    category: 'sweet-tooth',
    description: 'Fudgy, salty-sweet, still warm in the middle — melting the ice cream on contact before your spoon even gets there.',
    tint: 'var(--peach)',
  },

  // ---- Liquid Courage ----
  {
    id: 'midnight-mango',
    name: 'Midnight Mango',
    price: 229,
    category: 'liquid-courage',
    description: 'Sweet, tart, with a slow-building warmth at the finish — one glass and you’re already ordering the next.',
    tint: 'var(--lavender)',
  },
];

// Off-menu / hidden item — not part of the filterable grid.
export const OFF_MENU_ITEM = {
  id: 'chilli-crisp-carbonara',
  name: 'Chilli Crisp Carbonara',
  price: 449,
  category: 'off-menu',
  description: "Silky, glossy, laced with heat that creeps in after the first forkful — comfort food with a dare built into it.",
  tint: 'var(--lavender)',
};

export const ALL_ITEMS = [...MENU_ITEMS, OFF_MENU_ITEM];

export function findItem(id) {
  return ALL_ITEMS.find((item) => item.id === id);
}

// Signature dishes always lead within their category so the
// house specialty is the first thing a guest sees.
export function sortSignatureFirst(items) {
  return [...items].sort((a, b) => (b.signature === true) - (a.signature === true));
}

