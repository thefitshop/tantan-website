/* ============================================
   TANTAN — Stock Section
   Edit ONLY this file for stock changes.
   ============================================ */

function renderStock() {
  try {
    const stock    = getStock();
    const costs    = getCosts();
    const tbody    = document.getElementById('stock-tbody');
    const alertBox = document.getElementById('low-stock-alert');

    // ── Alert banner ──
    const outOfStock = PRODUCTS.filter(function (p) { return stock[p.id] === 0; });
    const critical   = PRODUCTS.filter(function (p) { return stock[p.id] > 0 && stock[p.id] <= 5; });
    const low        = PRODUCTS.filter(function (p) { return stock[p.id] > 5 && stock[p.id] <= 10; });

    if (outOfStock.length || critical.length) {
      const parts = [];
      if (outOfStock.length) parts.push(`<strong>${outOfStock.length} out of stock:</strong> ${outOfStock.map(function (p) { return p.name; }).join(', ')}`);
      if (critical.length)   parts.push(`<strong>${critical.length} critically low (5 or fewer):</strong> ${critical.map(function (p) { return p.name; }).join(', ')}`);
      alertBox.innerHTML = `<div class="dash-alert">⚠️ <span>${parts.join(' — ')}</span></div>`;
    } else if (low.length) {
      alertBox.innerHTML = `<div class="dash-alert warn">⚠️ <span><strong>${low.length} product${low.length > 1 ? 's' : ''} running low (10 or fewer):</strong> ${low.map(function (p) { return p.name; }).join(', ')}</span></div>`;
    } else {
      alertBox.innerHTML = `<div class="dash-alert success">✅ All products have healthy stock levels.</div>`;
    }

    // ── Table rows ──
    tbody.innerHTML = PRODUCTS.map(function (p) {
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

    // Single onclick assignment — no listener accumulation
    tbody.onclick = function (e) {
      const btn = e.target.closest('.update-btn');
      if (!btn) return;
      const row = btn.closest('tr[data-id]');
      const id  = +row.dataset.id;
      const s   = getStock();
      const c   = getCosts();
      s[id] = Math.max(0, parseInt(row.querySelector('.stock-input').value)  || 0);
      c[id] = Math.max(0, parseFloat(row.querySelector('.cost-input').value) || 0);
      saveStock(s);
      saveCosts(c);
      btn.textContent = '✅ Updated!';
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

  } catch (e) {
    console.error('[Stock] Render error:', e);
  }
}
