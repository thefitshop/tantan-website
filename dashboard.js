/* ============================================
   TANTAN — Dashboard Core
   Shared constants and helpers used by all
   section files. Only edit this file to add
   a new shared utility — never put section
   logic here.
   ============================================ */

// ── Constants ────────────────────────────────
const DASH_PASSWORD         = 'TanTan2026';
const SESSION_KEY           = 'tantan_dash_session';
const ORDERS_KEY            = 'tantan_orders';
const STOCK_KEY             = 'tantan_stock';
const COSTS_KEY             = 'tantan_costs';
const STATUS_KEY            = 'tantan_order_statuses';
const PRODUCT_OVERRIDES_KEY = 'tantan_product_overrides';
const CAT_NAMES_KEY         = 'tantan_cat_names';
const ADDED_PRODS_KEY       = 'tantan_added_products';
const DELETED_PRODS_KEY     = 'tantan_deleted_products';
const STATUS_OPTIONS = [
  { value: 'pending',    label: '🕐 Pending'    },
  { value: 'processing', label: '⚙️ Processing' },
  { value: 'dispatched', label: '🚚 Dispatched' },
  { value: 'delivered',  label: '✅ Delivered'  },
];

// ── Shared helpers ────────────────────────────
function fmt(n) { return '£' + Number(n || 0).toFixed(2); }

function getOrders()           { return JSON.parse(localStorage.getItem(ORDERS_KEY))            || []; }
function getStatuses()         { return JSON.parse(localStorage.getItem(STATUS_KEY))            || {}; }
function saveStatuses(s)       { localStorage.setItem(STATUS_KEY, JSON.stringify(s)); }
function getProductOverrides() { return JSON.parse(localStorage.getItem(PRODUCT_OVERRIDES_KEY)) || {}; }
function saveProductOverrides(o){ localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(o)); }
function getCatNames()         { return JSON.parse(localStorage.getItem(CAT_NAMES_KEY))         || {}; }
function saveCatNames(n)       { localStorage.setItem(CAT_NAMES_KEY, JSON.stringify(n)); }
function getAddedProducts()    { return JSON.parse(localStorage.getItem(ADDED_PRODS_KEY))       || []; }
function saveAddedProducts(a)  { localStorage.setItem(ADDED_PRODS_KEY, JSON.stringify(a)); }

function getStock() {
  const saved = JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  const out   = {};
  PRODUCTS.forEach(function (p) {
    out[p.id] = saved[p.id] !== undefined ? saved[p.id] : 50;
  });
  return out;
}

function getCosts() {
  const saved = JSON.parse(localStorage.getItem(COSTS_KEY)) || {};
  const out   = {};
  PRODUCTS.forEach(function (p) {
    out[p.id] = saved[p.id] !== undefined ? saved[p.id] : parseFloat((p.price * 0.5).toFixed(2));
  });
  return out;
}

function saveStock(s) { localStorage.setItem(STOCK_KEY, JSON.stringify(s)); }
function saveCosts(c) { localStorage.setItem(COSTS_KEY, JSON.stringify(c)); }

function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }
