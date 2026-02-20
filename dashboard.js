/* ============================================
   TANTAN — Owner Dashboard Logic
   ============================================
   Password: TanTan2026
   Change DASH_PASSWORD below to update it.
   ============================================ */

// ── Constants ────────────────────────────────
const DASH_PASSWORD         = 'TanTan2026';
const SESSION_KEY           = 'tantan_dash_session';
const ORDERS_KEY            = 'tantan_orders';
const STOCK_KEY             = 'tantan_stock';
const COSTS_KEY             = 'tantan_costs';
const STATUS_KEY            = 'tantan_order_statuses';
const PRODUCT_OVERRIDES_KEY = 'tantan_product_overrides';

// ── Helpers ──────────────────────────────────
function fmt(n) { return '£' + Number(n || 0).toFixed(2); }

function getOrders()  { return JSON.parse(localStorage.getItem(ORDERS_KEY))  || []; }
function getStatuses(){ return JSON.parse(localStorage.getItem(STATUS_KEY))   || {}; }
function saveStatuses(s){ localStorage.setItem(STATUS_KEY, JSON.stringify(s)); }
function getProductOverrides()  { return JSON.parse(localStorage.getItem(PRODUCT_OVERRIDES_KEY)) || {}; }
function saveProductOverrides(o){ localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(o)); }

function getStock() {
  const saved = JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  const out = {};
  PRODUCTS.forEach(p => { out[p.id] = saved[p.id] !== undefined ? saved[p.id] : 50; });
  return out;
}

function getCosts() {
  const saved = JSON.parse(localStorage.getItem(COSTS_KEY)) || {};
  const out = {};
  PRODUCTS.forEach(p => { out[p.id] = saved[p.id] !== undefined ? saved[p.id] : parseFloat((p.price * 0.5).toFixed(2)); });
  return out;
}

function saveStock(s) { localStorage.setItem(STOCK_KEY, JSON.stringify(s)); }
function saveCosts(c) { localStorage.setItem(COSTS_KEY, JSON.stringify(c)); }

// ── Auth ─────────────────────────────────────
function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }

function showDashboard() {
  document.getElementById('dash-login').style.display = 'none';
  document.getElementById('dash-app').style.display   = 'block';
  initDashboard();
}

function doLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById('dash-login-btn').addEventListener('click', function () {
  const val = document.getElementById('dash-password').value;
  if (val === DASH_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1');
    showDashboard();
  } else {
    document.getElementById('login-error').textContent = 'Incorrect password. Please try again.';
    document.getElementById('dash-password').value = '';
    document.getElementById('dash-password').focus();
  }
});

document.getElementById('dash-password').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') document.getElementById('dash-login-btn').click();
});

document.getElementById('dash-logout').addEventListener('click', doLogout);

// Auto-unlock if session is active
if (isLoggedIn()) showDashboard();

// ── Tab switching ─────────────────────────────
document.querySelectorAll('.dash-tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.dash-tab-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.dash-panel').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Init ─────────────────────────────────────
function initDashboard() {
  renderStock();
  renderOrders();
  renderCustomers();
  renderPL();
  renderProducts();
}

// ══════════════════════════════════════════════
//  STOCK
// ══════════════════════════════════════════════
function renderStock() {
  const stock    = getStock();
  const costs    = getCosts();
  const tbody    = document.getElementById('stock-tbody');
  const alertBox = document.getElementById('low-stock-alert');

  // Alert banner — split out of stock from critical
  const outOfStock = PRODUCTS.filter(p => stock[p.id] === 0);
  const critical   = PRODUCTS.filter(p => stock[p.id] > 0 && stock[p.id] <= 5);
  const low        = PRODUCTS.filter(p => stock[p.id] > 5  && stock[p.id] <= 10);

  if (outOfStock.length || critical.length) {
    const parts = [];
    if (outOfStock.length) parts.push(`<strong>${outOfStock.length} out of stock:</strong> ${outOfStock.map(p => p.name).join(', ')}`);
    if (critical.length)   parts.push(`<strong>${critical.length} critically low (5 or fewer):</strong> ${critical.map(p => p.name).join(', ')}`);
    alertBox.innerHTML = `<div class="dash-alert">⚠️ <span>${parts.join(' — ')}</span></div>`;
  } else if (low.length) {
    alertBox.innerHTML = `<div class="dash-alert warn">⚠️ <span><strong>${low.length} product${low.length > 1 ? 's' : ''} running low (10 or fewer):</strong> ${low.map(p => p.name).join(', ')}</span></div>`;
  } else {
    alertBox.innerHTML = `<div class="dash-alert success">✅ All products have healthy stock levels.</div>`;
  }

  // Table rows
  tbody.innerHTML = PRODUCTS.map(p => {
    const qty  = stock[p.id];
    const cost = costs[p.id];
    let badge;
    if (qty === 0)      badge = `<span class="badge badge-danger">Out of Stock</span>`;
    else if (qty <= 5)  badge = `<span class="badge badge-danger">Critical — ${qty}</span>`;
    else if (qty <= 10) badge = `<span class="badge badge-warn">Low — ${qty}</span>`;
    else                badge = `<span class="badge badge-ok">OK — ${qty}</span>`;

    return `<tr data-id="${p.id}">
      <td><strong>${p.name}</strong></td>
      <td style="color:var(--muted);font-size:0.82rem">${p.cat}</td>
      <td>${fmt(p.price)}</td>
      <td><input class="cost-input"  type="number" min="0" step="0.01" value="${cost.toFixed(2)}" /></td>
      <td><input class="stock-input" type="number" min="0" step="1"    value="${qty}" /></td>
      <td>${badge}</td>
      <td><button class="update-btn">Update</button></td>
    </tr>`;
  }).join('');

  // FIX: use tbody.onclick (single assignment) instead of addEventListener
  // — prevents event listeners stacking up every time renderStock() is called
  tbody.onclick = function (e) {
    const btn = e.target.closest('.update-btn');
    if (!btn) return;
    const row  = btn.closest('tr[data-id]');
    const id   = +row.dataset.id;
    const s    = getStock();
    const c    = getCosts();
    s[id] = Math.max(0, parseInt(row.querySelector('.stock-input').value)  || 0);
    c[id] = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);
    saveStock(s);
    saveCosts(c);
    btn.textContent = '✅ Updated!';
    // Short delay so user sees feedback before table re-renders
    setTimeout(function () { renderStock(); renderPL(); }, 800);
  };

  // Save all button
  document.getElementById('save-all-stock').onclick = function () {
    const s = getStock();
    const c = getCosts();
    tbody.querySelectorAll('tr[data-id]').forEach(function (row) {
      const id = +row.dataset.id;
      s[id] = Math.max(0, parseInt(row.querySelector('.stock-input').value)  || 0);
      c[id] = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);
    });
    saveStock(s);
    saveCosts(c);
    const saveBtn = document.getElementById('save-all-stock');
    saveBtn.textContent = '✅ All Saved!';
    setTimeout(function () {
      saveBtn.textContent = '💾 Save All Changes';
      renderStock();
      renderPL();
    }, 800);
  };
}

// ══════════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════════
const STATUS_OPTIONS = [
  { value: 'pending',    label: '🕐 Pending'    },
  { value: 'processing', label: '⚙️ Processing' },
  { value: 'dispatched', label: '🚚 Dispatched' },
  { value: 'delivered',  label: '✅ Delivered'  },
];

function renderOrders() {
  const orders   = getOrders().slice().reverse();
  const statuses = getStatuses();
  const tbody    = document.getElementById('orders-tbody');
  const empty    = document.getElementById('orders-empty');
  const wrap     = document.getElementById('orders-table-wrap');
  const countEl  = document.getElementById('order-count');

  countEl.textContent = `${orders.length} order${orders.length !== 1 ? 's' : ''}`;

  if (orders.length === 0) {
    wrap.style.display  = 'none';
    empty.style.display = 'block';
    return;
  }
  wrap.style.display  = 'block';
  empty.style.display = 'none';

  tbody.innerHTML = orders.map(function (o) {
    const d        = new Date(o.date);
    const dateStr  = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr  = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const items    = o.items.map(function (i) { return i.name + ' ×' + i.qty; }).join('<br>');
    const payBadge = o.paymentMethod === 'cash'
      ? '<span class="badge badge-cash">💵 Cash</span>'
      : '<span class="badge badge-card">💳 Card</span>';
    const cur  = statuses[o.id] || 'pending';
    const opts = STATUS_OPTIONS.map(function (s) {
      return `<option value="${s.value}"${s.value === cur ? ' selected' : ''}>${s.label}</option>`;
    }).join('');
    const addr = o.customer && o.customer.address
      ? `<span style="font-size:0.75rem;color:var(--muted)">${o.customer.address}, ${o.customer.city || ''} ${o.customer.postcode || ''}</span>`
      : '';

    return `<tr>
      <td><strong>${o.id}</strong></td>
      <td>${dateStr}<br><span style="font-size:0.75rem;color:var(--muted)">${timeStr}</span></td>
      <td>
        <strong>${(o.customer && o.customer.name) || '—'}</strong><br>
        <span style="font-size:0.75rem;color:var(--muted)">${(o.customer && o.customer.email) || ''}</span><br>
        <span style="font-size:0.75rem;color:var(--muted)">${(o.customer && o.customer.phone) || ''}</span><br>
        ${addr}
      </td>
      <td style="font-size:0.82rem;color:var(--muted)">${items}</td>
      <td>
        <strong>${fmt(o.total)}</strong><br>
        <span style="font-size:0.75rem;color:var(--muted)">incl. ${fmt(o.delivery || 0)} delivery</span>
      </td>
      <td>${payBadge}</td>
      <td><select class="status-select s-${cur}" data-order-id="${o.id}">${opts}</select></td>
    </tr>`;
  }).join('');

  // Status dropdowns — use onchange on each select (safe, no accumulation)
  tbody.querySelectorAll('.status-select').forEach(function (sel) {
    sel.onchange = function () {
      const s = getStatuses();
      s[sel.dataset.orderId] = sel.value;
      saveStatuses(s);
      sel.className = 'status-select s-' + sel.value;
    };
  });
}

// ══════════════════════════════════════════════
//  CUSTOMERS
// ══════════════════════════════════════════════
function renderCustomers() {
  const orders  = getOrders();
  const tbody   = document.getElementById('customers-tbody');
  const empty   = document.getElementById('customers-empty');
  const wrap    = document.getElementById('customers-table-wrap');
  const countEl = document.getElementById('customer-count');
  const map     = {};

  orders.forEach(function (o) {
    const key = ((o.customer && (o.customer.email || o.customer.name)) || 'unknown').toLowerCase().trim();
    if (!map[key]) {
      map[key] = {
        name:       (o.customer && o.customer.name)  || '—',
        email:      (o.customer && o.customer.email) || '—',
        phone:      (o.customer && o.customer.phone) || '—',
        orders:     0,
        totalSpent: 0,
        lastOrder:  null
      };
    }
    map[key].orders++;
    map[key].totalSpent += o.total;
    const d = new Date(o.date);
    if (!map[key].lastOrder || d > new Date(map[key].lastOrder)) map[key].lastOrder = o.date;
  });

  const customers = Object.values(map).sort(function (a, b) { return b.totalSpent - a.totalSpent; });
  countEl.textContent = `${customers.length} customer${customers.length !== 1 ? 's' : ''}`;

  if (customers.length === 0) {
    wrap.style.display  = 'none';
    empty.style.display = 'block';
    return;
  }
  wrap.style.display  = 'block';
  empty.style.display = 'none';

  tbody.innerHTML = customers.map(function (c) {
    const last = c.lastOrder
      ? new Date(c.lastOrder).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';
    return `<tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.orders}</td>
      <td><strong>${fmt(c.totalSpent)}</strong></td>
      <td>${last}</td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════
//  PROFIT & LOSS
// ══════════════════════════════════════════════
function renderPL() {
  const orders = getOrders();
  const costs  = getCosts();
  let totalRev = 0, totalCost = 0;

  orders.forEach(function (o) {
    totalRev  += o.total;
    totalCost += o.items.reduce(function (s, i) {
      return s + (costs[i.id] !== undefined ? costs[i.id] : i.price * 0.5) * i.qty;
    }, 0);
  });

  const profit   = totalRev - totalCost;
  const margin   = totalRev > 0 ? (profit / totalRev * 100) : 0;
  const avgOrder = orders.length > 0 ? totalRev / orders.length : 0;

  document.getElementById('pl-cards').innerHTML = `
    <div class="pl-card">
      <div class="pl-card-label">Total Revenue</div>
      <div class="pl-card-value">${fmt(totalRev)}</div>
      <div class="pl-card-sub">${orders.length} orders total</div>
    </div>
    <div class="pl-card">
      <div class="pl-card-label">Total Cost</div>
      <div class="pl-card-value red">${fmt(totalCost)}</div>
      <div class="pl-card-sub">Cost of goods sold</div>
    </div>
    <div class="pl-card">
      <div class="pl-card-label">Gross Profit</div>
      <div class="pl-card-value ${profit >= 0 ? 'green' : 'red'}">${fmt(profit)}</div>
      <div class="pl-card-sub">${margin.toFixed(1)}% margin</div>
    </div>
    <div class="pl-card">
      <div class="pl-card-label">Avg Order Value</div>
      <div class="pl-card-value">${fmt(avgOrder)}</div>
      <div class="pl-card-sub">Per order</div>
    </div>`;

  // Weekly breakdown — current month
  const now = new Date();
  const thisMonthOrders = orders.filter(function (o) {
    const d = new Date(o.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const weekLabels  = ['Week 1 (1–7)', 'Week 2 (8–14)', 'Week 3 (15–21)', 'Week 4 (22–28)', 'Week 5 (29+)'];
  const weekBuckets = [[], [], [], [], []];
  thisMonthOrders.forEach(function (o) {
    const day = new Date(o.date).getDate();
    const idx = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : day <= 28 ? 3 : 4;
    weekBuckets[idx].push(o);
  });

  document.getElementById('pl-weekly-tbody').innerHTML = weekLabels.map(function (label, i) {
    const wo   = weekBuckets[i];
    const rev  = wo.reduce(function (s, o) { return s + o.total; }, 0);
    const cost = wo.reduce(function (s, o) {
      return s + o.items.reduce(function (ss, it) {
        return ss + (costs[it.id] !== undefined ? costs[it.id] : it.price * 0.5) * it.qty;
      }, 0);
    }, 0);
    const pft = rev - cost;
    return `<tr>
      <td>${label}</td>
      <td>${wo.length}</td>
      <td>${fmt(rev)}</td>
      <td>${fmt(cost)}</td>
      <td style="font-weight:700;color:${pft >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(pft)}</td>
    </tr>`;
  }).join('');

  // Monthly summary — last 6 months
  const monthlyMap = {};
  for (let i = 5; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    monthlyMap[key] = { label: key, list: [] };
  }
  orders.forEach(function (o) {
    const d   = new Date(o.date);
    const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (monthlyMap[key]) monthlyMap[key].list.push(o);
  });

  document.getElementById('pl-monthly-tbody').innerHTML = Object.values(monthlyMap).map(function (m) {
    const rev  = m.list.reduce(function (s, o) { return s + o.total; }, 0);
    const cost = m.list.reduce(function (s, o) {
      return s + o.items.reduce(function (ss, it) {
        return ss + (costs[it.id] !== undefined ? costs[it.id] : it.price * 0.5) * it.qty;
      }, 0);
    }, 0);
    const pft = rev - cost;
    return `<tr>
      <td>${m.label}</td>
      <td>${m.list.length}</td>
      <td>${fmt(rev)}</td>
      <td>${fmt(cost)}</td>
      <td style="font-weight:700;color:${pft >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(pft)}</td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════════
function renderProducts() {
  const tbody     = document.getElementById('products-tbody');
  const overrides = getProductOverrides();
  const rows      = [];

  CAT_ORDER.forEach(function (cat) {
    const prods = PRODUCTS.filter(function (p) { return p.cat === cat; });
    if (!prods.length) return;
    rows.push(`<tr><td colspan="5" class="prod-cat-header">${cat}</td></tr>`);
    prods.forEach(function (p) {
      const isModified = !!overrides[p.id];
      const safeName   = p.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      rows.push(`<tr data-prod-id="${p.id}">
        <td style="color:var(--muted);font-size:0.82rem;padding-left:1.5rem">${p.cat}</td>
        <td><input class="prod-name-input" type="text"   value="${safeName}" /></td>
        <td><input class="cost-input"      type="number" min="0" step="0.01" value="${p.price.toFixed(2)}" /></td>
        <td class="prod-status">${isModified
          ? '<span class="badge badge-warn">Modified</span>'
          : '<span style="color:var(--muted);font-size:0.78rem">Default</span>'}</td>
        <td><button class="update-btn">Save</button></td>
      </tr>`);
    });
  });

  tbody.innerHTML = rows.join('');

  // FIX: use tbody.onclick (single assignment) — no listener accumulation
  tbody.onclick = function (e) {
    const btn = e.target.closest('.update-btn');
    if (!btn) return;
    const row = btn.closest('tr[data-prod-id]');
    if (!row) return;
    const id         = +row.dataset.prodId;
    const p          = PRODUCTS.find(function (x) { return x.id === id; });
    if (!p) return;
    const newName    = row.querySelector('.prod-name-input').value.trim() || p.name;
    const newPrice   = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);

    // Update in-memory PRODUCTS so P&L reflects the change
    p.name  = newName;
    p.price = newPrice;

    // Persist override to localStorage
    const ov = getProductOverrides();
    ov[id] = { name: newName, price: newPrice };
    saveProductOverrides(ov);

    const statusCell = row.querySelector('.prod-status');
    if (statusCell) statusCell.innerHTML = '<span class="badge badge-warn">Modified</span>';
    btn.textContent = '✅ Saved!';
    setTimeout(function () { btn.textContent = 'Save'; }, 2000);
  };

  // Save all button
  document.getElementById('save-all-products').onclick = function () {
    const ov = getProductOverrides();
    tbody.querySelectorAll('tr[data-prod-id]').forEach(function (row) {
      const id = +row.dataset.prodId;
      const p  = PRODUCTS.find(function (x) { return x.id === id; });
      if (!p) return;
      const newName  = row.querySelector('.prod-name-input').value.trim() || p.name;
      const newPrice = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);
      p.name  = newName;
      p.price = newPrice;
      ov[id]  = { name: newName, price: newPrice };
      const statusCell = row.querySelector('.prod-status');
      if (statusCell) statusCell.innerHTML = '<span class="badge badge-warn">Modified</span>';
    });
    saveProductOverrides(ov);
    const saveBtn = document.getElementById('save-all-products');
    saveBtn.textContent = '✅ All Saved!';
    setTimeout(function () { saveBtn.textContent = '💾 Save All Changes'; }, 2000);
  };
}
