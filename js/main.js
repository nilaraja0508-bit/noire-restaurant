// =========================================================
// NOIRÉ — Interactions
// Vanilla JS only. No frameworks, no build step.
// =========================================================

import { MENU_ITEMS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, findItem, sortSignatureFirst } from './data.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   NAVBAR — scroll state + mobile drawer
   ========================================================= */
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

function setMobileNavOpen(open) {
  hamburger.setAttribute('aria-expanded', String(open));
  mobileNav.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('is-open');
  setMobileNavOpen(!isOpen);
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileNavOpen(false));
});

// Close the mobile nav when clicking/tapping anywhere outside of it.
document.addEventListener('click', (e) => {
  if (!mobileNav.classList.contains('is-open')) return;
  if (mobileNav.contains(e.target) || hamburger.contains(e.target)) return;
  setMobileNavOpen(false);
});

/* =========================================================
   TOAST
   ========================================================= */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

/* =========================================================
   CART STATE
   ========================================================= */
const cart = new Map(); // id -> qty
const cartButtons = new Map(); // id -> Set of control elements to keep in sync

const cartToggle = document.getElementById('cart-toggle');
const cartBadge = document.getElementById('cart-badge');
const cartDrawer = document.getElementById('cart-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const cartClose = document.getElementById('cart-close');
const cartListEl = document.getElementById('cart-list');
const cartEmptyEl = document.getElementById('cart-empty');
const cartFooterEl = document.getElementById('cart-footer');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartBookBtn = document.getElementById('cart-book-btn');

function registerControl(id, el) {
  if (!cartButtons.has(id)) cartButtons.set(id, new Set());
  cartButtons.get(id).add(el);
}

function cartTotalCount() {
  let total = 0;
  cart.forEach((qty) => (total += qty));
  return total;
}

function cartSubtotal() {
  let total = 0;
  cart.forEach((qty, id) => {
    const item = findItem(id);
    if (item) total += item.price * qty;
  });
  return total;
}

function updateBadge() {
  const count = cartTotalCount();
  cartBadge.hidden = count === 0;
  cartBadge.textContent = String(count);
  cartToggle.setAttribute('aria-label', `Open cart, ${count} item${count === 1 ? '' : 's'}`);
}

function addLabelFor(el) {
  return el.dataset.name === 'Butter Chicken Lasagna' ? 'Add to Cart' : 'Add';
}

function buildControlMarkup(el, qty) {
  if (qty > 0) {
    return `
      <div class="qty-stepper">
        <button class="qty-btn" type="button" data-action="minus" aria-label="Remove one ${el.dataset.name || ''}">−</button>
        <span class="qty-value">${qty}</span>
        <button class="qty-btn" type="button" data-action="plus" aria-label="Add one more ${el.dataset.name || ''}">+</button>
      </div>`;
  }
  return `<button class="add-btn" type="button" aria-label="Add ${el.dataset.name || 'item'} to cart"><span class="add-btn-label">${addLabelFor(el)}</span></button>`;
}

function refreshControlsFor(id) {
  const qty = cart.get(id) || 0;
  const controls = cartButtons.get(id);
  if (!controls) return;
  controls.forEach((el) => {
    el.innerHTML = buildControlMarkup(el, qty);
  });
}

function addToCart(id, { silent = false } = {}) {
  const item = findItem(id);
  if (!item) return;
  const current = cart.get(id) || 0;
  cart.set(id, current + 1);
  updateBadge();
  renderCartList();

  // Momentary "ADDED" confirmation state before settling into a stepper.
  const controls = cartButtons.get(id);
  if (controls && current === 0) {
    controls.forEach((el) => {
      el.innerHTML = `<button class="add-btn is-added" type="button"><span class="add-btn-label">Added ✓</span></button>`;
    });
    setTimeout(() => refreshControlsFor(id), 750);
  } else {
    refreshControlsFor(id);
  }

  if (!silent) showToast(`${item.name} added to cart`);
}

function changeQty(id, delta) {
  const current = cart.get(id) || 0;
  const next = current + delta;
  if (next <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, next);
  }
  updateBadge();
  refreshControlsFor(id);
  renderCartList();
}

function removeFromCart(id) {
  cart.delete(id);
  updateBadge();
  refreshControlsFor(id);
  renderCartList();
}

function renderCartList() {
  const entries = [...cart.entries()];
  if (entries.length === 0) {
    cartListEl.innerHTML = '';
    cartEmptyEl.hidden = false;
    cartFooterEl.hidden = true;
    return;
  }

  cartEmptyEl.hidden = true;
  cartFooterEl.hidden = false;

  cartListEl.innerHTML = entries
    .map(([id, qty]) => {
      const item = findItem(id);
      if (!item) return '';
      return `
        <li class="cart-item" data-id="${id}">
          <div class="cart-item-media" aria-hidden="true">${item.name.charAt(0)}</div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="price">₹${item.price}</p>
            <div class="qty-stepper">
              <button class="qty-btn" type="button" data-cart-qty="minus" data-id="${id}" aria-label="Remove one ${item.name}">−</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn" type="button" data-cart-qty="plus" data-id="${id}" aria-label="Add one more ${item.name}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-remove="${id}" aria-label="Remove ${item.name} from cart" title="Remove">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7"/></svg>
          </button>
        </li>`;
    })
    .join('');

  cartSubtotalEl.textContent = `₹${cartSubtotal()}`;
}

cartListEl.addEventListener('click', (e) => {
  const removeId = e.target.closest('[data-remove]')?.dataset.remove;
  if (removeId) {
    removeFromCart(removeId);
    return;
  }
  const qtyBtn = e.target.closest('[data-cart-qty]');
  if (qtyBtn) {
    changeQty(qtyBtn.dataset.id, qtyBtn.dataset.cartQty === 'plus' ? 1 : -1);
  }
});

function openCart() {
  cartDrawer.hidden = false;
  drawerOverlay.hidden = false;
  requestAnimationFrame(() => {
    cartDrawer.classList.add('is-open');
    drawerOverlay.classList.add('is-visible');
  });
  cartToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  drawerOverlay.classList.remove('is-visible');
  cartToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => {
    cartDrawer.hidden = true;
    drawerOverlay.hidden = true;
  }, 380);
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
drawerOverlay.addEventListener('click', closeCart);
cartBookBtn.addEventListener('click', () => {
  closeCart();
  openModal();
});

// Delegate add/qty button clicks across the whole document
// (covers featured dish, off-menu card and every menu card).
document.addEventListener('click', (e) => {
  const stepperBtn = e.target.closest('.qty-btn');
  if (stepperBtn) {
    const id = stepperBtn.closest('.cart-control')?.dataset.id;
    if (id) changeQty(id, stepperBtn.dataset.action === 'plus' ? 1 : -1);
    return;
  }

  const addBtn = e.target.closest('.add-btn');
  if (addBtn) {
    const id = addBtn.closest('.cart-control')?.dataset.id;
    if (id) addToCart(id);
  }
});

// Register the static cart controls (featured dish + off-menu item)
document.querySelectorAll('.cart-control[data-id]').forEach((el) => {
  registerControl(el.dataset.id, el);
});

/* =========================================================
   MENU GRID — render + filter
   ========================================================= */
const menuGrid = document.getElementById('menu-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryDescriptionEl = document.getElementById('category-description');
let activeFilter = 'all';

function cardMarkup(item) {
  return `
    <li class="menu-card" data-category="${item.category}">
      <div class="dish-media" style="--tint:${item.tint}">
        <img src="images/${item.id}.jpg?v=2" alt="${item.name}" loading="lazy" onload="this.classList.add('is-loaded')" onerror="this.closest('.dish-media').classList.add('img-missing')">
        <span class="dish-monogram" aria-hidden="true">${item.name.charAt(0)}</span>
        ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <span class="category-label">${CATEGORY_LABELS[item.category]}</span>
        <h3>${item.name}</h3>
        <p class="description">${item.description}</p>
        <div class="card-footer">
          <span class="price">₹${item.price}</span>
          <div class="cart-control" data-id="${item.id}" data-name="${item.name}"></div>
        </div>
      </div>
    </li>`;
}

function renderGrid(filter) {
  // Drop registrations for controls about to be discarded so the map
  // doesn't accumulate stale detached elements across filter changes.
  menuGrid.querySelectorAll('.cart-control[data-id]').forEach((el) => {
    cartButtons.get(el.dataset.id)?.delete(el);
  });

  categoryDescriptionEl.textContent = CATEGORY_DESCRIPTIONS[filter] || '';

  const filtered = filter === 'all' ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === filter);
  const items = filter === 'all' ? filtered : sortSignatureFirst(filtered);
  menuGrid.innerHTML = items.map(cardMarkup).join('');

  // Register newly created controls and sync to current cart quantities.
  menuGrid.querySelectorAll('.cart-control[data-id]').forEach((el) => {
    registerControl(el.dataset.id, el);
    refreshControlsFor(el.dataset.id);
  });

  if (prefersReducedMotion) return;

  const cards = menuGrid.querySelectorAll('.menu-card');
  cards.forEach((card, i) => {
    card.classList.add('card-entering');
    setTimeout(() => {
      card.classList.add('card-enter-active');
    }, 30 + i * 35);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === activeFilter) return;
    activeFilter = filter;

    filterButtons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });

    renderGrid(filter);
  });
});

renderGrid(activeFilter);

/* =========================================================
   OFF MENU — reveal interaction
   ========================================================= */
const revealBtn = document.getElementById('reveal-off-menu');
const offMenuCard = document.getElementById('off-menu-card');

revealBtn.addEventListener('click', () => {
  const revealed = offMenuCard.dataset.revealed === 'true';
  offMenuCard.dataset.revealed = String(!revealed);
  revealBtn.setAttribute('aria-expanded', String(!revealed));
  revealBtn.textContent = revealed ? 'Reveal It' : 'Hide It';

  if (!revealed && !prefersReducedMotion) {
    offMenuCard.classList.add('is-glitching');
    setTimeout(() => offMenuCard.classList.remove('is-glitching'), 450);
  }
});

/* =========================================================
   RESERVATION MODAL
   ========================================================= */
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('reservation-modal');
const modalClose = document.getElementById('modal-close');
const reservationForm = document.getElementById('reservation-form');
const modalSuccess = document.getElementById('modal-success');
let lastFocusedEl = null;

function openModal() {
  lastFocusedEl = document.activeElement;
  reservationForm.hidden = false;
  modalSuccess.hidden = true;
  modal.hidden = false;
  modalOverlay.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    modalOverlay.classList.add('is-visible');
  });
  document.body.style.overflow = 'hidden';
  modal.querySelector('input')?.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modalOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.hidden = true;
    modalOverlay.hidden = true;
  }, 320);
  lastFocusedEl?.focus();
}

['book-table-nav', 'book-table-hero', 'book-table-mobile', 'book-table-cta'].forEach((id) => {
  document.getElementById(id)?.addEventListener('click', () => {
    setMobileNavOpen(false);
    openModal();
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  reservationForm.hidden = true;
  modalSuccess.hidden = false;
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!modal.hidden) closeModal();
  if (cartDrawer.classList.contains('is-open')) closeCart();
  if (mobileNav.classList.contains('is-open')) setMobileNavOpen(false);
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealTargets = '[data-reveal], [data-reveal-pop]';
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Toggle (rather than unobserve) so the pop/reveal replays every
        // time a section scrolls in and out of view, not just once.
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 180px 0px' }
  );
  document.querySelectorAll(revealTargets).forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(revealTargets).forEach((el) => el.classList.add('is-visible'));
}

/* =========================================================
   HERO WORDMARK DOCKING
   The big centered "NOIRÉ" wordmark glides up and shrinks into
   the navbar logo's position as the page scrolls, and smoothly
   reverses when scrolling back up. Driven every frame by the
   live scroll position rather than a one-off CSS transition, so
   it always tracks scroll direction exactly.
   ========================================================= */
const heroWordmark = document.getElementById('hero-wordmark');
const heroWordmarkSpacer = document.querySelector('.hero-wordmark-spacer');
const navLogo = document.querySelector('.site-header .logo');

if (heroWordmark && heroWordmarkSpacer && navLogo && !prefersReducedMotion) {
  document.body.classList.add('hero-dock-active');

  let startCenterX = 0;
  let startCenterY = 0;
  let smoothProgress = 0;
  let ticking = false;

  function measureStart() {
    const rect = heroWordmarkSpacer.getBoundingClientRect();
    startCenterX = rect.left + rect.width / 2;
    startCenterY = rect.top + rect.height / 2 + window.scrollY;
  }

  function renderDock() {
    const dockRange = Math.max(window.innerHeight * 0.55, 320);
    const rawProgress = Math.min(Math.max(window.scrollY / dockRange, 0), 1);
    smoothProgress += (rawProgress - smoothProgress) * 0.16;
    if (Math.abs(rawProgress - smoothProgress) < 0.0008) smoothProgress = rawProgress;

    const navRect = navLogo.getBoundingClientRect();
    const navCenterX = navRect.left + navRect.width / 2;
    const navCenterY = navRect.top + navRect.height / 2;
    const navFontSize = parseFloat(getComputedStyle(navLogo).fontSize);
    const startFontSize = parseFloat(getComputedStyle(heroWordmarkSpacer).fontSize);

    const originY = startCenterY - window.scrollY;
    const currentX = startCenterX + (navCenterX - startCenterX) * smoothProgress;
    const currentY = originY + (navCenterY - originY) * smoothProgress;
    const currentSize = startFontSize + (navFontSize - startFontSize) * smoothProgress;

    heroWordmark.style.left = `${currentX}px`;
    heroWordmark.style.top = `${currentY}px`;
    heroWordmark.style.fontSize = `${currentSize}px`;
    heroWordmark.classList.toggle('is-docked', smoothProgress > 0.97);

    if (Math.abs(rawProgress - smoothProgress) > 0.001) {
      requestAnimationFrame(renderDock);
    } else {
      ticking = false;
    }
  }

  function requestRender() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(renderDock);
  }

  measureStart();
  requestRender();
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', () => {
    measureStart();
    requestRender();
  });
}

/* =========================================================
   CUSTOM CURSOR (desktop / fine pointer only)
   ========================================================= */
if (window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('cursor-active');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, .menu-card, input');
    ring.classList.toggle('is-hovering', Boolean(interactive));
  });
}
