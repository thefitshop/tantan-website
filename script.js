/* ============================================
   TANTAN — JavaScript
   Shopping basket + page logic
   ============================================ */

// ── Products catalogue ──────────────────────
const PRODUCTS = [
  { id: 1, name: 'Self-Tan Mousse',       desc: 'Ultra-light foam for a flawless, streak-free bronze lasting up to 7 days.',          price: 24.99, emoji: '✨', grad: 'g1' },
  { id: 2, name: 'Gradual Tan Lotion',    desc: 'Build your perfect glow over 3–5 days with our nourishing daily moisturiser.',        price: 19.99, emoji: '🌿', grad: 'g2' },
  { id: 3, name: 'Tanning Oil',           desc: 'Tropical coconut & argan oil for a deep, golden colour with a gorgeous scent.',       price: 22.99, emoji: '🌴', grad: 'g3' },
  { id: 4, name: 'Tan Accelerator',       desc: 'Our best-selling formula boosts natural tan development up to 3× faster.',            price: 29.99, emoji: '⚡', grad: 'g4' },
  { id: 5, name: 'After-Sun Moisturiser', desc: 'Soothe, cool and extend your tan with aloe vera, vitamin E & shea butter.',          price: 18.99, emoji: '🌸', grad: 'g5' },
  { id: 6, name: 'Face Tan Drops',        desc: 'Buildable serum drops mixed into your moisturiser for a natural-looking glow.',       price: 27.99, emoji: '💫', grad: 'g6' },
  { id: 7, name: 'Tanning Mitt',          desc: 'Premium double-sided velvet applicator for a perfectly streak-free finish.',          price: 9.99,  emoji: '🧤', grad: 'g7' },
  { id: 8, name: 'Tan Remover Scrub',     desc: 'Gently erase old, uneven tan and prep skin for a fresh, flawless application.',      price: 14.99, emoji: '🫧', grad: 'g8' },
];

// ── Basket (localStorage) ───────────────────
const KEY = 'tantan_basket';

function getBasket()           { return JSON.parse(localStorage.getItem(KEY)) || []; }
function saveBasket(b)         { localStorage.setItem(KEY, JSON.stringify(b)); refreshBadge(); }
function clearBasket()         { localStorage.removeItem(KEY); refreshBadge(); }
function basketCount()         { return getBasket().reduce((n, i) => n + i.qty, 0); }
function basketTotal()         { return getBasket().reduce((n, i) => n + i.price * i.qty, 0); }
function fmt(n)                { return '£' + n.toFixed(2); }

function addToBasket(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const b = getBasket();
  const existing = b.find(x => x.id === id);
  if (existing) { existing.qty += 1; } else { b.push({ ...p, qty: 1 }); }
  saveBasket(b);
}

function removeFromBasket(id) {
  saveBasket(getBasket().filter(x => x.id !== id));
}

function changeQty(id, delta) {
  const b = getBasket();
  const item = b.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { saveBasket(b.filter(x => x.id !== id)); } else { saveBasket(b); }
}

// ── Badge ───────────────────────────────────
function refreshBadge() {
  const badge = document.getElementById('basket-badge');
  if (!badge) return;
  const n = basketCount();
  badge.textContent = n;
  badge.style.display = n > 0 ? 'flex' : 'none';
  if (n > 0) { badge.classList.add('pop'); setTimeout(() => badge.classList.remove('pop'), 300); }
}

// ── Toast ────────────────────────────────────
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 2600);
}

// ── Mobile nav ───────────────────────────────
function initNav() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
  });
}

// ══════════════════════════════════════════════
//  PAGE: PRODUCTS
// ══════════════════════════════════════════════
function initProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <div class="product-img ${p.grad}">${p.emoji}</div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${fmt(p.price)}</div>
          <button class="add-btn" data-id="${p.id}">+ Add to Basket</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = +btn.dataset.id;
    addToBasket(id);
    const p = PRODUCTS.find(x => x.id === id);
    showToast(`✓ ${p.name} added to basket`);
    btn.textContent = '✓ Added!';
    btn.classList.add('confirm');
    setTimeout(() => { btn.textContent = '+ Add to Basket'; btn.classList.remove('confirm'); }, 1400);
  });
}

// Featured products on home page (3 products)
function initFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[5]];
  grid.innerHTML = featured.map(p => `
    <div class="product-card">
      <div class="product-img ${p.grad}">${p.emoji}</div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${fmt(p.price)}</div>
          <button class="add-btn" data-id="${p.id}">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = +btn.dataset.id;
    addToBasket(id);
    const p = PRODUCTS.find(x => x.id === id);
    showToast(`✓ ${p.name} added to basket`);
    btn.textContent = '✓ Added!';
    btn.classList.add('confirm');
    setTimeout(() => { btn.textContent = '+ Add'; btn.classList.remove('confirm'); }, 1400);
  });
}

// ══════════════════════════════════════════════
//  PAGE: BASKET
// ══════════════════════════════════════════════
function renderBasket() {
  const list    = document.getElementById('basket-list');
  const summary = document.getElementById('basket-summary');
  const empty   = document.getElementById('basket-empty');
  if (!list) return;

  const basket = getBasket();

  if (basket.length === 0) {
    list.innerHTML = '';
    if (summary) summary.style.display = 'none';
    if (empty)   empty.style.display   = 'block';
    return;
  }

  if (summary) summary.style.display = '';
  if (empty)   empty.style.display   = 'none';

  list.innerHTML = basket.map(item => `
    <div class="basket-item" data-id="${item.id}">
      <div class="basket-item-img ${item.grad}">${item.emoji}</div>
      <div class="basket-item-info">
        <div class="basket-item-name">${item.name}</div>
        <div class="basket-item-price">${fmt(item.price)} each</div>
      </div>
      <div class="basket-item-controls">
        <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        <button class="remove-btn" data-action="remove" data-id="${item.id}" title="Remove">✕</button>
      </div>
    </div>
  `).join('');

  // Summary
  const subtotal  = basketTotal();
  const delivery  = subtotal >= 30 ? 0 : 3.99;
  const total     = subtotal + delivery;

  const subEl  = document.getElementById('sum-subtotal');
  const delEl  = document.getElementById('sum-delivery');
  const totEl  = document.getElementById('sum-total');
  if (subEl) subEl.textContent = fmt(subtotal);
  if (delEl) {
    delEl.textContent = delivery === 0 ? 'FREE' : fmt(delivery);
    delEl.className = delivery === 0 ? 'free-delivery' : '';
  }
  if (totEl) totEl.textContent = fmt(total);
}

function initBasket() {
  const list = document.getElementById('basket-list');
  if (!list) return;

  renderBasket();

  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id  = +btn.dataset.id;
    const act = btn.dataset.action;
    if (act === 'inc')    changeQty(id, +1);
    if (act === 'dec')    changeQty(id, -1);
    if (act === 'remove') removeFromBasket(id);
    renderBasket();
  });
}

// ══════════════════════════════════════════════
//  PAGE: CHECKOUT
// ══════════════════════════════════════════════
function initCheckout() {
  const wrapper = document.getElementById('checkout-wrapper');
  if (!wrapper) return;

  // Populate order summary
  const coList = document.getElementById('co-list');
  const coSub  = document.getElementById('co-subtotal');
  const coDel  = document.getElementById('co-delivery');
  const coTot  = document.getElementById('co-total');

  const basket   = getBasket();
  const subtotal = basketTotal();
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total    = subtotal + delivery;

  if (coList) {
    if (basket.length === 0) {
      coList.innerHTML = '<p style="color:var(--muted);font-size:.875rem">Your basket is empty.</p>';
    } else {
      coList.innerHTML = basket.map(i => `
        <div class="co-item">
          <div>
            <div class="co-item-name">${i.name}</div>
            <div class="co-item-qty">× ${i.qty}</div>
          </div>
          <div class="co-item-price">${fmt(i.price * i.qty)}</div>
        </div>
      `).join('');
    }
  }
  if (coSub) coSub.textContent = fmt(subtotal);
  if (coDel) { coDel.textContent = delivery === 0 ? 'FREE' : fmt(delivery); coDel.className = delivery === 0 ? 'free-delivery' : ''; }
  if (coTot) coTot.textContent = fmt(total);

  // Payment method toggle
  const payOptions = document.querySelectorAll('.pay-option');
  const cardForm   = document.getElementById('card-form');
  const cashInfo   = document.getElementById('cash-info');

  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const method = opt.dataset.method;
      if (cardForm) cardForm.classList.toggle('show', method === 'card');
      if (cashInfo) cashInfo.classList.toggle('show', method === 'cash');
    });
  });

  // Place order
  const placeBtn = document.getElementById('place-order-btn');
  const form     = document.getElementById('checkout-form');
  const success  = document.getElementById('order-success');

  if (placeBtn && form) {
    placeBtn.addEventListener('click', () => {
      const selected = document.querySelector('.pay-option.selected');
      if (!selected) { showToast('Please select a payment method'); return; }

      if (selected.dataset.method === 'card') {
        const inputs = cardForm.querySelectorAll('input');
        for (const inp of inputs) {
          if (!inp.value.trim()) { showToast('Please fill in all card details'); inp.focus(); return; }
        }
      }

      if (basket.length === 0) { showToast('Your basket is empty'); return; }

      // Success!
      clearBasket();
      if (wrapper)  wrapper.style.display = 'none';
      if (success)  success.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ── Boot ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshBadge();
  initNav();
  initFeatured();
  initProducts();
  initBasket();
  initCheckout();
});
