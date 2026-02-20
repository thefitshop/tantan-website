/* ============================================
   TANTAN — Login & Init
   Handles password login, session management,
   tab switching, and booting all sections.

   Edit only this file for login / session
   changes. Do NOT add section logic here.
   ============================================ */

function showDashboard() {
  document.getElementById('dash-login').style.display = 'none';
  document.getElementById('dash-app').style.display   = 'block';
  initDashboard();
}

function doLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// ── Login button ──────────────────────────────
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

// ── Tab switching ─────────────────────────────
document.querySelectorAll('.dash-tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.dash-tab-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.dash-panel').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Init — loads every section with error isolation ──────
// If one section throws an error it is caught here so the
// rest of the dashboard still loads normally.
function initDashboard() {
  var sections = [
    { name: 'Stock',            fn: renderStock            },
    { name: 'Orders',           fn: renderOrders           },
    { name: 'Customers',        fn: renderCustomers        },
    { name: 'P&L',              fn: renderPL               },
    { name: 'Products',         fn: renderProducts         },
    { name: 'Popular Products', fn: renderPopular          },
    { name: 'Category Editor',  fn: renderCategoryEditor   },
    { name: 'Add Product Form', fn: initAddProductForm     },
    { name: 'Security Log',     fn: startSecurityPolling   },
  ];

  sections.forEach(function (section) {
    try {
      section.fn();
    } catch (e) {
      console.error('[TanTan Dashboard] ' + section.name + ' failed to load:', e);
    }
  });
}

// ── Auto-unlock if session already active ─────
if (isLoggedIn()) showDashboard();
