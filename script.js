/* ============================================
   TANTAN — JavaScript
   Shopping basket + page logic
   ============================================ */

// ── Products catalogue ──────────────────────
const PRODUCTS = [

  // ── Self Tans ──
  { id: 1, cat: 'Self Tans', name: 'Self-Tan Mousse',       emoji: '✨', grad: 'g1',   price: 24.99, desc: 'Ultra-light foam for a flawless, streak-free bronze lasting up to 7 days.' },
  { id: 2, cat: 'Self Tans', name: 'Gradual Tan Lotion',    emoji: '🌿', grad: 'g2',   price: 19.99, desc: 'Build your perfect glow over 3–5 days with our nourishing daily moisturiser.' },
  { id: 4, cat: 'Self Tans', name: 'Tan Accelerator',       emoji: '⚡', grad: 'g4',   price: 29.99, desc: 'Our best-selling formula boosts natural tan development up to 3× faster.' },
  { id: 6, cat: 'Self Tans', name: 'Face Tan Drops',        emoji: '💫', grad: 'g6',   price: 27.99, desc: 'Buildable serum drops mixed into your moisturiser for a natural-looking glow.' },

  // ── Tanning Oils ──
  { id: 3,  cat: 'Tanning Oils', name: 'Tanning Oil',               emoji: '🌴', grad: 'g3',   price: 22.99, desc: 'Tropical coconut & argan oil for a deep, golden colour with a gorgeous scent.' },
  { id: 9,  cat: 'Tanning Oils', name: 'Strawberry Tanning Oil',    emoji: '🍓', grad: 'gfrs', price: 19.99, desc: 'Sun-ripened strawberry extract blended with vitamin E and argan oil for a deep, luscious golden tan and an irresistible fruity fragrance.' },
  { id: 10, cat: 'Tanning Oils', name: 'Orange Tanning Oil',        emoji: '🍊', grad: 'gfro', price: 19.99, desc: 'Vitamin C-packed orange peel extract combined with light-reflecting pigments to boost your tan and leave skin glowing with a zesty citrus scent.' },
  { id: 11, cat: 'Tanning Oils', name: 'Watermelon Tanning Oil',    emoji: '🍉', grad: 'gfrw', price: 19.99, desc: 'Refreshing watermelon extract and hyaluronic acid deeply hydrate as you tan, leaving skin dewy, plump and sun-kissed with a cooling summer scent.' },
  { id: 12, cat: 'Tanning Oils', name: 'Coconut Tanning Oil',       emoji: '🥥', grad: 'gfrc', price: 21.99, desc: 'Signature tropical blend of coconut oil and monoi de Tahiti that deepens your tan beautifully while wrapping you in a dreamy island fragrance.' },

  // ── Aerosol Tans ──
  { id: 13, cat: 'Aerosol Tans', name: 'Strawberry Aerosol Tan',    emoji: '🍓', grad: 'gfrs', price: 16.99, desc: 'A fine strawberry-scented mist that delivers a natural, streak-free bronze in seconds. Dries instantly with no sticky residue — perfect for on-the-go touch-ups.' },
  { id: 14, cat: 'Aerosol Tans', name: 'Orange Aerosol Tan',        emoji: '🍊', grad: 'gfro', price: 16.99, desc: 'Zesty citrus-scented aerosol formula that builds a gorgeous, even bronze in one or two applications. Lightweight, fast-drying and transfer-resistant.' },
  { id: 15, cat: 'Aerosol Tans', name: 'Watermelon Aerosol Tan',    emoji: '🍉', grad: 'gfrw', price: 16.99, desc: 'Cool and refreshing watermelon-scented aerosol that sprays on evenly for a seamless, buildable tan. Infused with aloe vera to keep skin soft and smooth.' },
  { id: 16, cat: 'Aerosol Tans', name: 'Coconut Aerosol Tan',       emoji: '🥥', grad: 'gfrc', price: 17.99, desc: 'Luxurious coconut-scented aerosol tan that wraps skin in a veil of golden colour. Moisturising formula prevents patchiness for a long-lasting, salon-quality finish.' },

  // ── Spray Tan Solution ──
  { id: 17, cat: 'Spray Tan Solution', name: 'Spray Tan Solution Light',  emoji: '🌤️', grad: 'gspl', price: 26.99, desc: 'Professional-grade light spray tan solution for a subtle, holiday-kissed glow. Develops naturally over 4–6 hours, perfect for fair to medium skin tones. 1 litre.' },
  { id: 18, cat: 'Spray Tan Solution', name: 'Spray Tan Solution Medium', emoji: '☀️', grad: 'gspm', price: 26.99, desc: 'Our bestselling medium spray tan solution delivers a beautiful, natural-looking bronze for all skin tones. Fast-developing 2-hour formula with a fresh, clean scent. 1 litre.' },
  { id: 19, cat: 'Spray Tan Solution', name: 'Spray Tan Solution Dark',   emoji: '🌅', grad: 'gspd', price: 28.99, desc: 'Rich, deep dark spray tan solution for a dramatic, sun-soaked bronze. Ultra-long-lasting 8–10 day wear with a luxurious cosmetic bronzer for instant results. 1 litre.' },

  // ── Tanning Gel ──
  { id: 20, cat: 'Tanning Gel', name: 'Tanning Gel Light Strawberry',  emoji: '🍓', grad: 'gfrs', price: 21.99, desc: 'A light, fresh strawberry-scented clear gel for a subtle, buildable glow. Absorbs instantly with no stickiness — ideal for fair skin or a first-time tan.' },
  { id: 21, cat: 'Tanning Gel', name: 'Tanning Gel Medium Orange',      emoji: '🍊', grad: 'gfro', price: 22.99, desc: 'Citrus-fresh orange gel that develops into a warm, sun-kissed medium bronze. Enriched with vitamin C and shea butter for a nourished, radiant finish.' },
  { id: 22, cat: 'Tanning Gel', name: 'Tanning Gel Dark Coconut',       emoji: '🥥', grad: 'gfrc', price: 23.99, desc: 'Intensely rich coconut gel for a deep, long-lasting tan. Coconut milk and hyaluronic acid lock in moisture while DHA develops a flawless dark colour.' },
  { id: 23, cat: 'Tanning Gel', name: 'Tanning Gel Light Watermelon',   emoji: '🍉', grad: 'gfrw', price: 21.99, desc: 'Refreshing watermelon-scented gel that glides on effortlessly for a subtle, natural-looking glow. Infused with watermelon seed oil to keep skin silky soft.' },
  { id: 24, cat: 'Tanning Gel', name: 'Tanning Gel Medium Strawberry',  emoji: '🍓', grad: 'gfrs', price: 22.99, desc: 'Medium-depth strawberry gel packed with antioxidant-rich strawberry extract. Develops into a gorgeous, rosy-bronze tan that lasts up to 7 days.' },
  { id: 25, cat: 'Tanning Gel', name: 'Tanning Gel Dark Orange',        emoji: '🍊', grad: 'gfro', price: 23.99, desc: 'Our deepest orange-scented gel for a rich, intense tan. Argan oil and vitamin E ensure deep hydration while DHA creates a streak-free, dark bronze glow.' },

  // ── Skincare ──
  { id: 5, cat: 'Skincare', name: 'After-Sun Moisturiser', emoji: '🌸', grad: 'g5', price: 18.99, desc: 'Soothe, cool and extend your tan with aloe vera, vitamin E & shea butter.' },
  { id: 8, cat: 'Skincare', name: 'Tan Remover Scrub',     emoji: '🫧', grad: 'g8', price: 14.99, desc: 'Gently erase old, uneven tan and prep skin for a fresh, flawless application.' },

  // ── Self Tanning Drops ──
  { id: 26, cat: 'Self Tanning Drops', name: 'Strawberry Self Tanning Drops',  emoji: '🍓', grad: 'gfrs', price: 22.99, desc: 'Buildable self-tanning drops infused with ripe strawberry extract. Mix a few drops into your moisturiser for a customisable, natural-looking glow with a fresh fruity scent.' },
  { id: 27, cat: 'Self Tanning Drops', name: 'Orange Self Tanning Drops',       emoji: '🍊', grad: 'gfro', price: 22.99, desc: 'Vitamin C-rich orange tanning drops that blend seamlessly into any moisturiser. Build from a subtle sun-kissed glow to a deep golden tan — completely streak-free.' },
  { id: 28, cat: 'Self Tanning Drops', name: 'Watermelon Self Tanning Drops',   emoji: '🍉', grad: 'gfrw', price: 22.99, desc: 'Cooling watermelon tanning drops packed with hydrating watermelon seed oil. Mix into your favourite moisturiser for a refreshing, buildable tan that nourishes as it develops.' },
  { id: 29, cat: 'Self Tanning Drops', name: 'Coconut Self Tanning Drops',      emoji: '🥥', grad: 'gfrc', price: 24.99, desc: 'Luxurious coconut tanning drops enriched with coconut milk. Add to your daily moisturiser for a gorgeous, customisable bronze with an irresistible island scent.' },

  // ── Bronzing Butter ──
  { id: 30, cat: 'Bronzing Butter', name: 'Bronzing Butter Light',  emoji: '🧈', grad: 'gspl', price: 21.99, desc: 'A rich, velvety light bronzing butter that melts into skin for a sheer, sun-touched glow. Shea butter and vitamin E deliver deep hydration alongside a beautiful, natural colour.' },
  { id: 31, cat: 'Bronzing Butter', name: 'Bronzing Butter Medium', emoji: '🧈', grad: 'gspm', price: 21.99, desc: 'Our nourishing medium bronzing butter delivers a warm, golden bronze while intensely moisturising. Mango butter and jojoba oil leave skin silky-smooth and radiantly glowing.' },
  { id: 32, cat: 'Bronzing Butter', name: 'Bronzing Butter Dark',   emoji: '🧈', grad: 'gspd', price: 23.99, desc: 'Deeply indulgent dark bronzing butter for a rich, luxurious tan. Formulated with argan oil, cocoa butter and DHA for a long-lasting, deeply moisturising colour.' },

  // ── Tanning Water ──
  { id: 33, cat: 'Tanning Water', name: 'Strawberry Tanning Water', emoji: '🍓', grad: 'gfrs', price: 17.99, desc: 'Ultra-light, fast-absorbing tanning water with a sweet strawberry scent. Spritz over clean skin for a buildable, even tan that dries in seconds — no streaks, no stickiness.' },
  { id: 34, cat: 'Tanning Water', name: 'Orange Tanning Water',     emoji: '🍊', grad: 'gfro', price: 17.99, desc: 'Refreshing orange-scented tanning water that delivers a natural-looking bronze with zero effort. The ultra-fine mist absorbs instantly, leaving skin glowing with a fresh citrus scent.' },
  { id: 35, cat: 'Tanning Water', name: 'Coconut Tanning Water',    emoji: '🥥', grad: 'gfrc', price: 17.99, desc: 'Dreamy coconut-scented tanning water for the most effortless glow. Mist on and let it dry for a perfectly even, tropical-scented tan that builds beautifully with each application.' },

  // ── Tanning Foam ──
  { id: 36, cat: 'Tanning Foam', name: 'Tanning Foam Light',  emoji: '🫧', grad: 'gspl', price: 21.99, desc: 'A featherlight, fast-drying foam for a gentle, natural-looking light tan. The airy texture glides on effortlessly and develops into a flawless subtle glow in just 4–6 hours.' },
  { id: 37, cat: 'Tanning Foam', name: 'Tanning Foam Medium', emoji: '🫧', grad: 'gspm', price: 21.99, desc: 'Our velvety medium tanning foam strikes the perfect balance — rich enough for a stunning bronze, light enough to feel like nothing on skin. Develops beautifully in 2–4 hours.' },
  { id: 38, cat: 'Tanning Foam', name: 'Tanning Foam Dark',   emoji: '🫧', grad: 'gspd', price: 23.99, desc: 'Luxuriously rich dark tanning foam for a bold, deep bronze. Packed with colour-boosting DHA and moisturising aloe vera, it develops into a dramatic, long-lasting tan in just 1–2 hours.' },

  // ── Tanning Mitts ──
  { id: 39, cat: 'Tanning Mitts', name: 'Tanning Mitt Small',  emoji: '🧤', grad: 'g7', price: 15.00, desc: 'Our compact small mitt is perfect for precise application on hard-to-reach areas like the face, hands and ankles. Soft velvet finish ensures a seamless, streak-free result every time.' },
  { id: 40, cat: 'Tanning Mitts', name: 'Tanning Mitt Medium', emoji: '🧤', grad: 'g7', price: 15.00, desc: 'The everyday essential. Our medium mitt fits most hands perfectly and glides product on evenly across arms, legs and the torso — your go-to for a flawless, professional-looking tan.' },
  { id: 41, cat: 'Tanning Mitts', name: 'Tanning Mitt Large',  emoji: '🧤', grad: 'g7', price: 15.00, desc: 'Cover more skin in less time with our generously sized large mitt. Ideal for quickly and evenly applying tanning product across the back, stomach and legs for a salon-quality finish at home.' },

  // ── Accessories ──
  { id: 7, cat: 'Accessories', name: 'Tanning Mitt', emoji: '🧤', grad: 'g7', price: 9.99, desc: 'Premium double-sided velvet applicator for a perfectly streak-free finish.' },
];

// ── Category display config ───────────────────
const CAT_ORDER = [
  'Tanning Oils',
  'Aerosol Tans',
  'Spray Tan Solution',
  'Tanning Gel',
  'Self Tanning Drops',
  'Bronzing Butter',
  'Tanning Water',
  'Tanning Foam',
  'Self Tans',
  'Skincare',
  'Tanning Mitts',
  'Accessories',
];

const CAT_ICONS = {
  'Tanning Oils':       '🫙',
  'Aerosol Tans':       '💨',
  'Spray Tan Solution': '💎',
  'Tanning Gel':        '✨',
  'Self Tanning Drops': '💧',
  'Bronzing Butter':    '🧈',
  'Tanning Water':      '💦',
  'Tanning Foam':       '🫧',
  'Self Tans':          '🌟',
  'Skincare':           '🌸',
  'Tanning Mitts':      '🧤',
  'Accessories':        '🧤',
};

// ── Basket (localStorage) ───────────────────
const KEY = 'tantan_basket';

function getBasket()  { return JSON.parse(localStorage.getItem(KEY)) || []; }
function saveBasket(b){ localStorage.setItem(KEY, JSON.stringify(b)); refreshBadge(); }
function clearBasket(){ localStorage.removeItem(KEY); refreshBadge(); }
function basketCount(){ return getBasket().reduce((n, i) => n + i.qty, 0); }
function basketTotal(){ return getBasket().reduce((n, i) => n + i.price * i.qty, 0); }
function fmt(n)       { return '£' + n.toFixed(2); }

function addToBasket(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const b = getBasket();
  const existing = b.find(x => x.id === id);
  if (existing) { existing.qty += 1; } else { b.push({ ...p, qty: 1 }); }
  saveBasket(b);
}

function removeFromBasket(id) { saveBasket(getBasket().filter(x => x.id !== id)); }

function changeQty(id, delta) {
  const b = getBasket();
  const item = b.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { saveBasket(b.filter(x => x.id !== id)); } else { saveBasket(b); }
}

// ── Badge ────────────────────────────────────
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
  const btn   = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
  });
}

// ── Shared: product card HTML ─────────────────
function productCardHTML(p, btnLabel = '+ Add to Basket') {
  return `
    <div class="product-card">
      <div class="product-img ${p.grad}">${p.emoji}</div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${fmt(p.price)}</div>
          <button class="add-btn" data-id="${p.id}">${btnLabel}</button>
        </div>
      </div>
    </div>`;
}

function attachAddHandlers(container, btnLabel) {
  container.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = +btn.dataset.id;
    addToBasket(id);
    const p = PRODUCTS.find(x => x.id === id);
    showToast(`✓ ${p.name} added to basket`);
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.classList.add('confirm');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('confirm'); }, 1400);
  });
}

// ══════════════════════════════════════════════
//  PAGE: PRODUCTS (grouped by category)
// ══════════════════════════════════════════════
function initProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Group products by category
  const grouped = {};
  PRODUCTS.forEach(p => {
    if (!grouped[p.cat]) grouped[p.cat] = [];
    grouped[p.cat].push(p);
  });

  container.innerHTML = CAT_ORDER
    .filter(cat => grouped[cat])
    .map(cat => `
      <div class="cat-section">
        <h2 class="cat-title"><span class="cat-icon">${CAT_ICONS[cat] || ''}</span>${cat}</h2>
        <div class="products-grid">
          ${grouped[cat].map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    `).join('');

  attachAddHandlers(container, '+ Add to Basket');
}

// ── Featured products on home page ───────────
function initFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[5]]; // Mousse, Tan Accelerator, Strawberry Oil
  grid.innerHTML = featured.map(p => productCardHTML(p, '+ Add')).join('');
  attachAddHandlers(grid, '+ Add');
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

  const subtotal = basketTotal();
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total    = subtotal + delivery;

  const subEl = document.getElementById('sum-subtotal');
  const delEl = document.getElementById('sum-delivery');
  const totEl = document.getElementById('sum-total');
  if (subEl) subEl.textContent = fmt(subtotal);
  if (delEl) { delEl.textContent = delivery === 0 ? 'FREE' : fmt(delivery); delEl.className = delivery === 0 ? 'free-delivery' : ''; }
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

  const coList = document.getElementById('co-list');
  const coSub  = document.getElementById('co-subtotal');
  const coDel  = document.getElementById('co-delivery');
  const coTot  = document.getElementById('co-total');

  const basket   = getBasket();
  const subtotal = basketTotal();
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total    = subtotal + delivery;

  if (coList) {
    coList.innerHTML = basket.length === 0
      ? '<p style="color:var(--muted);font-size:.875rem">Your basket is empty.</p>'
      : basket.map(i => `
          <div class="co-item">
            <div>
              <div class="co-item-name">${i.name}</div>
              <div class="co-item-qty">× ${i.qty}</div>
            </div>
            <div class="co-item-price">${fmt(i.price * i.qty)}</div>
          </div>`).join('');
  }
  if (coSub) coSub.textContent = fmt(subtotal);
  if (coDel) { coDel.textContent = delivery === 0 ? 'FREE' : fmt(delivery); coDel.className = delivery === 0 ? 'free-delivery' : ''; }
  if (coTot) coTot.textContent = fmt(total);

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

  const placeBtn = document.getElementById('place-order-btn');
  const success  = document.getElementById('order-success');

  if (placeBtn) {
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
      clearBasket();
      if (wrapper) wrapper.style.display = 'none';
      if (success) success.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshBadge();
  initNav();
  initFeatured();
  initProducts();
  initBasket();
  initCheckout();
});
