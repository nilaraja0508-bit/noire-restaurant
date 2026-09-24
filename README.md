# NOIRÉ

**Indian soul. Global chaos.**
*Off menu. On purpose.*

A premium, dark, Gen-Z-inspired restaurant website built as a frontend design showcase. NOIRÉ collides familiar Indian flavours with global comfort food — butter chicken lasagna, tandoori udon, chilli crisp carbonara — and the site itself is built to feel like an expensive night out: dark obsidian backgrounds, a single electric-lime accent used sparingly, and editorial food photography as the visual hero.

No frameworks, no build step — just semantic HTML, hand-written CSS, and vanilla JavaScript.

---

## Features

- **Editorial hero** — a full-bleed centered wordmark that smoothly docks into the navbar logo as you scroll
- **Interactive menu** — category filtering (Small Chaos, Handheld, Main Character, Sweet Tooth, Liquid Courage) with animated card transitions and signature dishes surfaced first
- **Cart drawer** — add-to-cart micro-interactions, in-drawer quantity steppers, and item removal, all client-side (no backend)
- **Off Menu** — a hidden, glitch-reveal easter egg dish
- **Reservation modal** — a mocked "Book a Table" flow
- **Scroll-driven reveals** — sections and cards animate in as you scroll, with full `prefers-reduced-motion` support
- **Custom cursor** — subtle desktop-only cursor that reacts to interactive elements
- **Fully responsive** — fluid typography and layout across mobile, tablet, laptop, and desktop

## Tech stack

- HTML5 (semantic, accessible markup)
- CSS3 (custom properties, `clamp()`-based fluid type/spacing, no framework)
- Vanilla JavaScript (ES modules — menu data lives separately from rendering logic)
- Google Fonts (Space Grotesk, Inter, Playfair Display)

## Project structure

```
noire/
├── index.html          # All markup/sections (hero, menu, off-menu, story, CTA, footer)
├── css/
│   └── style.css       # Full design system + responsive rules
├── js/
│   ├── data.js          # Menu items, categories, and copy — kept separate from UI
│   └── main.js          # Cart, filtering, reveals, modal, nav, cursor logic
└── images/              # Dish photography (see below)
```

## Running locally

This is a static site — no npm install, no build step. Because `js/main.js` uses ES modules, open it through a local server rather than double-clicking `index.html` (modules are blocked on `file://` by browser CORS rules).

```bash
cd noire
python -m http.server 5500
```

Then visit `http://localhost:5500/`.

## Adding photography

Dish images are referenced by id at `images/<dish-id>.jpg` (e.g. `images/butter-chicken-lasagna.jpg`). If an image is missing, the card gracefully falls back to an art-directed tinted placeholder instead of a broken image icon — so photos can be dropped in one at a time without touching any code.

## Notes

This project prioritizes frontend design, interaction, and responsiveness over backend functionality — the cart, reservation form, and menu are all local/mock data with no server behind them, by design.
