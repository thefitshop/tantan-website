/* ============================================
   TANTAN — Owner Dashboard Logic
   ============================================
   Default password: TanTan2026
   Change DASH_PASSWORD below to update it.
   ============================================ */

const DASH_PASSWORD = 'TanTan2026';
const SESSION_KEY   = 'tantan_dash_session';
const ORDERS_KEY    = 'tantan_orders';
const STOCK_KEY     = 'tantan_stock';
const COSTS_KEY     = 'tantan_costs';
const STATUS_KEY    = 'tantan_order_statuses';

// ── Helpers ──────────────────────────────────
function fmt(n) { return '£' + Number(n).toFixed(2); }
function getOrders() { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }

function getStock() {
  const saved = JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  const result = {};
  PRODUCTS.forEach(p => { result[p.id] = saved[p.id] !== undefined ? saved[p.id] : 50; });
  return result;
}

function getCosts() {
  const saved = JSON.parse(localStorage.getItem(COSTS_KEY)) || {};
  const result = {};
  PRODUCTS.forEach(p => { result[p.id] = saved[p.id] !== undefined ? saved[p.id] : parseFloat((p.price * 0.5).toFixed(2)); });
  return result;
}

function saveStock(s) { localStorage.setItem(STOCK_KEY, JSON.stringify(s)); }
function saveCosts(c) { localStorage.setItem(COSTS_KEY, JSON.stringify(c)); }
function getStatuses() { return JSON.parse(localStorage.getItem(STATUS_KEY)) || {}; }
function saveStatuses(s) { localStorage.setItem(STATUS_KEY, JSON.stringify(s)); }

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

document.getElementById('dash-login-btn').addEventListener('click', () => {
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

document.getElementById('dash-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('dash-login-btn').click();
});

document.getElementById('dash-logout').addEventListener('click', doLogout);

// Auto-unlock if session is active
if (isLoggedIn()) showDashboard();

// ── Tab switching ─────────────────────────────
document.querySelectorAll('.dash-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
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

// ── Stock ─────────────────────────────────────
function renderStock() {
  const stock = getStock();
  const costs = getCosts();
  const tbody = document.getElementById('stock-tbody');
  const alertBox = document.getElementById('low-stock-alert');

  const critical = PRODUCTS.filter(p => stock[p.id] <= 5);
  const low      = PRODUCTS.filter(p => stock[p.id] > 5 && stock[p.id] <= 10);

  if (critical.length > 0) {
    alertBox.innerHTML = `<div class="dash-alert">⚠️ <span><strong>${critical.length} product${critical.length > 1 ? 's are' : ' is'} critically low (5 or fewer):</strong> ${critical.map(p => p.name).join(', ')}</span></div>`;
  } else if (low.length > 0) {
    alertBox.innerHTML = `<div class="dash-alert warn">⚠️ <span><strong>${low.length} product${low.length > 1 ? 's are' : ' is'} running low (10 or fewer):</strong> ${low.map(p => p.name).join(', ')}</span></div>`;
  } else {
    alertBox.innerHTML = `<div class="dash-alert success">✅ All products have healthy stock levels.</div>`;
  }

  tbody.innerHTML = PRODUCTS.map(p => {
    const qty  = stock[p.id];
    const cost = costs[p.id];
    let badge;
    if (qty <= 5)       badge = `<span class="badge badge-danger">Critical — ${qty}</span>`;
    else if (qty <= 10) badge = `<span class="badge badge-warn">Low — ${qty}</span>`;
    else                badge = `<span class="badge badge-ok">OK — ${qty}</span>`;

    return `<tr>
      <td><strong>${p.name}</strong></td>
      <td style="color:var(--muted);font-size:0.82rem">${p.cat}</td>
      <td>${fmt(p.price)}</td>
      <td><input class="cost-input" type="number" min="0" step="0.01" value="${cost.toFixed(2)}" data-id="${p.id}" data-type="cost" /></td>
      <td><input class="stock-input" type="number" min="0" step="1" value="${qty}" data-id="${p.id}" data-type="stock" /></td>
      <td>${badge}</td>
      <td><button class="update-btn" data-update="${p.id}">Update</button></td>
    </tr>`;
  }).join('');

  // Per-row update
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('[data-update]');
    if (!btn) return;
    const id = +btn.dataset.update;
    const s = getStock(), c = getCosts();
    s[id] = Math.max(0, parseInt(tbody.querySelector(`input[data-id="${id}"][data-type="stock"]`).value) || 0);
    c[id] = Math.max(0, parseFloat(tbody.querySelector(`input[data-id="${id}"][data-type="cost"]`).value) || 0);
    saveStock(s); saveCosts(c);
    renderStock(); renderPL();
  });

  // Save all
  document.getElementById('save-all-stock').onclick = () => {
    const s = getStock(), c = getCosts();
    tbody.querySelectorAll('input[data-type="stock"]').forEach(inp => { s[+inp.dataset.id] = Math.max(0, parseInt(inp.value) || 0); });
    tbody.querySelectorAll('input[data-type="cost"]').forEach(inp => { c[+inp.dataset.id] = Math.max(0, parseFloat(inp.value) || 0); });
    saveStock(s); saveCosts(c);
    renderStock(); renderPL();
    const btn = document.getElementById('save-all-stock');
    const orig = btn.textContent;
    btn.textContent = '✅ Saved!';
    setTimeout(() => btn.textContent = orig, 2000);
  };
}

// ── Orders ────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'pending',    label: '🕐 Pending' },
  { value: 'processing', label: '⚙️ Processing' },
  { value: 'dispatched', label: '🚚 Dispatched' },
  { value: 'delivered',  label: '✅ Delivered' },
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
    wrap.style.display = 'none'; empty.style.display = 'block'; return;
  }
  wrap.style.display = 'block'; empty.style.display = 'none';

  tbody.innerHTML = orders.map(o => {
    const d        = new Date(o.date);
    const dateStr  = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr  = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const items    = o.items.map(i => `${i.name} ×${i.qty}`).join('<br>');
    const payBadge = o.paymentMethod === 'cash'
      ? '<span class="badge badge-cash">💵 Cash</span>'
      : '<span class="badge badge-card">💳 Card</span>';
    const currentStatus = statuses[o.id] || 'pending';
    const statusOptions = STATUS_OPTIONS.map(s =>
      `<option value="${s.value}" ${s.value === currentStatus ? 'selected' : ''}>${s.label}</option>`
    ).join('');
    return `<tr>
      <td><strong>${o.id}</strong></td>
      <td>${dateStr}<br><span style="font-size:0.75rem;color:var(--muted)">${timeStr}</span></td>
      <td>
        <strong>${o.customer.name || '—'}</strong><br>
        <span style="font-size:0.75rem;color:var(--muted)">${o.customer.email || ''}</span><br>
        <span style="font-size:0.75rem;color:var(--muted)">${o.customer.phone || ''}</span><br>
        ${o.customer.address ? `<span style="font-size:0.75rem;color:var(--muted)">${o.customer.address}, ${o.customer.city || ''} ${o.customer.postcode || ''}</span>` : ''}
      </td>
      <td style="font-size:0.82rem;color:var(--muted)">${items}</td>
      <td><strong>${fmt(o.total)}</strong><br><span style="font-size:0.75rem;color:var(--muted)">incl. ${fmt(o.delivery)} delivery</span></td>
      <td>${payBadge}</td>
      <td><select class="status-select s-${currentStatus}" data-order-id="${o.id}">${statusOptions}</select></td>
    </tr>`;
  }).join('');

  // Save status on change
  tbody.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const s = getStatuses();
      s[sel.dataset.orderId] = sel.value;
      saveStatuses(s);
      sel.className = `status-select s-${sel.value}`;
    });
  });
}

// ── Customers ─────────────────────────────────
function renderCustomers() {
  const orders    = getOrders();
  const tbody     = document.getElementById('customers-tbody');
  const empty     = document.getElementById('customers-empty');
  const wrap      = document.getElementById('customers-table-wrap');
  const countEl   = document.getElementById('customer-count');
  const customerMap = {};

  orders.forEach(o => {
    const key = o.customer.email || o.customer.name || 'unknown';
    if (!customerMap[key]) {
      customerMap[key] = { name: o.customer.name || '—', email: o.customer.email || '—', phone: o.customer.phone || '—', orders: 0, totalSpent: 0, lastOrder: null };
    }
    customerMap[key].orders++;
    customerMap[key].totalSpent += o.total;
    const d = new Date(o.date);
    if (!customerMap[key].lastOrder || d > new Date(customerMap[key].lastOrder)) customerMap[key].lastOrder = o.date;
  });

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  countEl.textContent = `${customers.length} customer${customers.length !== 1 ? 's' : ''}`;

  if (customers.length === 0) {
    wrap.style.display = 'none'; empty.style.display = 'block'; return;
  }
  wrap.style.display = 'block'; empty.style.display = 'none';

  tbody.innerHTML = customers.map(c => {
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

// ── P&L ──────────────────────────────────────
function renderPL() {
  const orders = getOrders();
  const costs  = getCosts();
  let totalRev = 0, totalCost = 0;

  orders.forEach(o => {
    totalRev  += o.total;
    totalCost += o.items.reduce((s, i) => s + (costs[i.id] !== undefined ? costs[i.id] : i.price * 0.5) * i.qty, 0);
  });

  const profit = totalRev - totalCost;
  const margin = totalRev > 0 ? (profit / totalRev * 100) : 0;
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

  // Weekly (current month)
  const now = new Date();
  const thisMonthOrders = orders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const weeks = ['Week 1 (1–7)', 'Week 2 (8–14)', 'Week 3 (15–21)', 'Week 4 (22–28)', 'Week 5 (29+)'];
  const weekBuckets = [[], [], [], [], []];
  thisMonthOrders.forEach(o => {
    const day = new Date(o.date).getDate();
    const idx = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : day <= 28 ? 3 : 4;
    weekBuckets[idx].push(o);
  });

  document.getElementById('pl-weekly-tbody').innerHTML = weeks.map((label, i) => {
    const wo = weekBuckets[i];
    const rev  = wo.reduce((s, o) => s + o.total, 0);
    const cost = wo.reduce((s, o) => s + o.items.reduce((ss, it) => ss + (costs[it.id] !== undefined ? costs[it.id] : it.price * 0.5) * it.qty, 0), 0);
    const pft  = rev - cost;
    return `<tr>
      <td>${label}</td><td>${wo.length}</td><td>${fmt(rev)}</td><td>${fmt(cost)}</td>
      <td style="font-weight:700;color:${pft >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(pft)}</td>
    </tr>`;
  }).join('');

  // Monthly (last 6 months)
  const monthlyMap = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    monthlyMap[key] = { label: key, list: [], m: d.getMonth(), y: d.getFullYear() };
  }
  orders.forEach(o => {
    const d = new Date(o.date);
    const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (monthlyMap[key]) monthlyMap[key].list.push(o);
  });

  document.getElementById('pl-monthly-tbody').innerHTML = Object.values(monthlyMap).map(({ label, list }) => {
    const rev  = list.reduce((s, o) => s + o.total, 0);
    const cost = list.reduce((s, o) => s + o.items.reduce((ss, it) => ss + (costs[it.id] !== undefined ? costs[it.id] : it.price * 0.5) * it.qty, 0), 0);
    const pft  = rev - cost;
    return `<tr>
      <td>${label}</td><td>${list.length}</td><td>${fmt(rev)}</td><td>${fmt(cost)}</td>
      <td style="font-weight:700;color:${pft >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(pft)}</td>
    </tr>`;
  }).join('');
}

// ── Products ──────────────────────────────────
const PRODUCT_OVERRIDES_KEY = 'tantan_product_overrides';
function getProductOverrides()  { return JSON.parse(localStorage.getItem(PRODUCT_OVERRIDES_KEY)) || {}; }
function saveProductOverrides(o){ localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(o)); }

function renderProducts() {
  const tbody     = document.getElementById('products-tbody');
  const overrides = getProductOverrides();
  const rows      = [];

  CAT_ORDER.forEach(cat => {
    const prods = PRODUCTS.filter(p => p.cat === cat);
    if (!prods.length) return;
    rows.push(`<tr><td colspan="5" class="prod-cat-header">${cat}</td></tr>`);
    prods.forEach(p => {
      const isModified = !!overrides[p.id];
      const safeName   = p.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      rows.push(`<tr>
        <td></td>
        <td><input class="prod-name-input" type="text" value="${safeName}" data-id="${p.id}" data-field="name" /></td>
        <td><input class="cost-input" type="number" min="0" step="0.01" value="${p.price.toFixed(2)}" data-id="${p.id}" data-field="price" /></td>
        <td class="prod-status">${isModified ? '<span class="badge badge-warn">Modified</span>' : '<span style="color:var(--muted);font-size:0.78rem">Default</span>'}</td>
        <td><button class="update-btn" data-prod-update="${p.id}">Save</button></td>
      </tr>`);
    });
  });

  tbody.innerHTML = rows.join('');

  // Per-row save
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('[data-prod-update]');
    if (!btn) return;
    const id         = +btn.dataset.prodUpdate;
    const p          = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const row        = btn.closest('tr');
    const nameInput  = row.querySelector('input[data-field="name"]');
    const priceInput = row.querySelector('input[data-field="price"]');
    const newName    = nameInput.value.trim() || p.name;
    const newPrice   = Math.max(0, parseFloat(priceInput.value) || 0);

    // Update in-memory PRODUCTS so P&L tab reflects change
    p.name  = newName;
    p.price = newPrice;

    // Persist to localStorage
    const ov = getProductOverrides();
    ov[id] = { name: newName, price: newPrice };
    saveProductOverrides(ov);

    // Inline feedback
    const statusCell = row.querySelector('.prod-status');
    if (statusCell) statusCell.innerHTML = '<span class="badge badge-warn">Modified</span>';
    btn.textContent = '✅ Saved!';
    setTimeout(() => { btn.textContent = 'Save'; }, 2000);
  });

  // Save all
  document.getElementById('save-all-products').onclick = () => {
    const ov = getProductOverrides();
    tbody.querySelectorAll('tr').forEach(row => {
      const nameInput  = row.querySelector('input[data-field="name"]');
      const priceInput = row.querySelector('input[data-field="price"]');
      if (!nameInput) return;
      const id = +nameInput.dataset.id;
      const p  = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      const newName  = nameInput.value.trim() || p.name;
      const newPrice = Math.max(0, parseFloat(priceInput.value) || 0);
      p.name  = newName;
      p.price = newPrice;
      ov[id]  = { name: newName, price: newPrice };
      const statusCell = row.querySelector('.prod-status');
      if (statusCell) statusCell.innerHTML = '<span class="badge badge-warn">Modified</span>';
    });
    saveProductOverrides(ov);
    const saveBtn = document.getElementById('save-all-products');
    const orig    = saveBtn.textContent;
    saveBtn.textContent = '✅ All Saved!';
    setTimeout(() => { saveBtn.textContent = orig; }, 2000);
  };
}
