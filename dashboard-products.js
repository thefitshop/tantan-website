/* ============================================
   TANTAN — Products Section
   Edit ONLY this file for product management,
   category renaming, and add-product changes.
   ============================================ */

// ── Products table ────────────────────────────
function renderProducts() {
  try {
    const tbody     = document.getElementById('products-tbody');
    const overrides = getProductOverrides();
    const rows      = [];

    CAT_ORDER.forEach(function (cat) {
      const prods = PRODUCTS.filter(function (p) { return p.cat === cat; });
      if (!prods.length) return;
      rows.push(`<tr><td colspan="6" class="prod-cat-header">${cat}</td></tr>`);
      prods.forEach(function (p) {
        const isModified = !!overrides[p.id];
        const safeName   = p.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        const catOpts    = CAT_ORDER.map(function (c) {
          return `<option value="${c}"${c === p.cat ? ' selected' : ''}>${c}</option>`;
        }).join('');
        rows.push(`<tr data-prod-id="${p.id}">
          <td><select class="prod-cat-select">${catOpts}</select></td>
          <td><input class="prod-name-input" type="text"   value="${safeName}" /></td>
          <td><input class="cost-input"      type="number" min="0" step="0.01" value="${p.price.toFixed(2)}" /></td>
          <td class="prod-status">${isModified
            ? '<span class="badge badge-warn">Modified</span>'
            : '<span style="color:var(--muted);font-size:0.78rem">Default</span>'}</td>
          <td><button class="update-btn">Save</button></td>
          <td><button class="delete-prod-btn" title="Delete product">🗑️</button></td>
        </tr>`);
      });
    });

    tbody.innerHTML = rows.join('');

    // Single onclick — no listener accumulation
    tbody.onclick = function (e) {
      // Delete
      const delBtn = e.target.closest('.delete-prod-btn');
      if (delBtn) {
        const row   = delBtn.closest('tr[data-prod-id]');
        if (!row) return;
        const id    = +row.dataset.prodId;
        const p     = PRODUCTS.find(function (x) { return x.id === id; });
        const label = p ? p.name : 'this product';
        if (!confirm('Delete "' + label + '"? This cannot be undone.')) return;

        const idx = PRODUCTS.findIndex(function (x) { return x.id === id; });
        if (idx !== -1) PRODUCTS.splice(idx, 1);

        const ov = getProductOverrides();
        delete ov[id];
        saveProductOverrides(ov);
        saveAddedProducts(getAddedProducts().filter(function (ap) { return ap.id !== id; }));

        const deleted = JSON.parse(localStorage.getItem(DELETED_PRODS_KEY)) || [];
        if (!deleted.includes(id)) deleted.push(id);
        localStorage.setItem(DELETED_PRODS_KEY, JSON.stringify(deleted));

        renderProducts();
        renderPopular();
        return;
      }

      // Save single row
      const btn = e.target.closest('.update-btn');
      if (!btn) return;
      const row = btn.closest('tr[data-prod-id]');
      if (!row) return;
      const id       = +row.dataset.prodId;
      const p        = PRODUCTS.find(function (x) { return x.id === id; });
      if (!p) return;
      const newName  = row.querySelector('.prod-name-input').value.trim() || p.name;
      const newPrice = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);
      const newCat   = row.querySelector('.prod-cat-select').value;

      p.name  = newName;
      p.price = newPrice;
      p.cat   = newCat;

      const ov = getProductOverrides();
      ov[id]   = { name: newName, price: newPrice, cat: newCat };
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
        const newCat   = row.querySelector('.prod-cat-select').value;
        p.name  = newName;
        p.price = newPrice;
        p.cat   = newCat;
        ov[id]  = { name: newName, price: newPrice, cat: newCat };
        const statusCell = row.querySelector('.prod-status');
        if (statusCell) statusCell.innerHTML = '<span class="badge badge-warn">Modified</span>';
      });
      saveProductOverrides(ov);
      const saveBtn = document.getElementById('save-all-products');
      saveBtn.textContent = '✅ All Saved!';
      setTimeout(function () { saveBtn.textContent = '💾 Save All Changes'; }, 2000);
    };

  } catch (e) {
    console.error('[Products] Render error:', e);
  }
}

// ── Category name editor ──────────────────────
function renderCategoryEditor() {
  try {
    const grid = document.getElementById('cat-names-grid');
    if (!grid) return;

    grid.innerHTML = CAT_ORDER.map(function (cat) {
      const safe = cat.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<div class="cat-name-row">
        <span class="cat-name-current">${cat}</span>
        <input class="prod-name-input cat-name-input" type="text" value="${safe}" />
        <button class="update-btn">Rename</button>
      </div>`;
    }).join('');

    grid.onclick = function (e) {
      const btn = e.target.closest('.update-btn');
      if (!btn) return;
      const row     = btn.closest('.cat-name-row');
      const current = row.querySelector('.cat-name-current').textContent;
      const newName = row.querySelector('.cat-name-input').value.trim();

      if (!newName || newName === current) {
        btn.textContent = 'No change';
        setTimeout(function () { btn.textContent = 'Rename'; }, 1500);
        return;
      }

      // Trace back to original built-in key so chain renames don't stack
      const catNames = getCatNames();
      let origKey = current;
      Object.keys(catNames).forEach(function (k) {
        if (catNames[k] === current) origKey = k;
      });
      catNames[origKey] = newName;
      saveCatNames(catNames);

      // Apply in-memory
      const idx = CAT_ORDER.indexOf(current);
      if (idx !== -1) CAT_ORDER[idx] = newName;
      PRODUCTS.forEach(function (p) { if (p.cat === current) p.cat = newName; });
      if (typeof CAT_ICONS !== 'undefined' && CAT_ICONS[current] !== undefined) {
        CAT_ICONS[newName] = CAT_ICONS[current];
      }

      // Refresh add-product category dropdown
      const catSel = document.getElementById('new-prod-cat');
      if (catSel) {
        catSel.innerHTML = CAT_ORDER.map(function (c) {
          return `<option value="${c}">${c}</option>`;
        }).join('');
      }

      btn.textContent = '✅ Renamed!';
      setTimeout(function () { renderCategoryEditor(); renderProducts(); }, 800);
    };

  } catch (e) {
    console.error('[Category Editor] Render error:', e);
  }
}

// ── Add new product form ──────────────────────
function initAddProductForm() {
  try {
    const toggleBtn = document.getElementById('add-prod-toggle');
    const form      = document.getElementById('add-prod-form');
    const catSelect = document.getElementById('new-prod-cat');
    const submitBtn = document.getElementById('add-prod-submit');
    const errorEl   = document.getElementById('add-prod-error');
    if (!toggleBtn || !form) return;

    catSelect.innerHTML = CAT_ORDER.map(function (c) {
      return `<option value="${c}">${c}</option>`;
    }).join('');

    toggleBtn.onclick = function () {
      const isOpen      = form.style.display !== 'none';
      form.style.display    = isOpen ? 'none' : 'block';
      toggleBtn.textContent = isOpen ? '＋ New Product' : '✕ Cancel';
    };

    submitBtn.onclick = function () {
      errorEl.textContent = '';
      const name  = document.getElementById('new-prod-name').value.trim();
      const cat   = catSelect.value;
      const price = parseFloat(document.getElementById('new-prod-price').value);
      const desc  = document.getElementById('new-prod-desc').value.trim();
      const emoji = document.getElementById('new-prod-emoji').value.trim() || '✨';
      const grad  = document.getElementById('new-prod-grad').value;

      if (!name)                     { errorEl.textContent = 'Please enter a product name.';   return; }
      if (!cat)                      { errorEl.textContent = 'Please select a category.';      return; }
      if (isNaN(price) || price < 0) { errorEl.textContent = 'Please enter a valid price.';   return; }
      if (!desc)                     { errorEl.textContent = 'Please enter a description.';    return; }

      const newProd = { id: Date.now(), cat, name, emoji, grad, price, desc };

      const added = getAddedProducts();
      added.push(newProd);
      saveAddedProducts(added);
      PRODUCTS.push(newProd);

      document.getElementById('new-prod-name').value  = '';
      document.getElementById('new-prod-price').value = '';
      document.getElementById('new-prod-desc').value  = '';
      document.getElementById('new-prod-emoji').value = '';
      form.style.display    = 'none';
      toggleBtn.textContent = '＋ New Product';

      submitBtn.textContent = '✅ Product Added!';
      setTimeout(function () {
        submitBtn.textContent = '+ Add Product';
        renderProducts();
        renderPopular();
      }, 800);
    };

  } catch (e) {
    console.error('[Add Product Form] Init error:', e);
  }
}
