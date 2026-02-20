/* ============================================
   TANTAN — Popular Products Section
   Edit ONLY this file for popular products
   changes.
   ============================================ */

function renderPopular() {
  try {
    const orders  = getOrders();
    const emptyEl = document.getElementById('popular-empty');
    const content = document.getElementById('popular-content');

    if (orders.length === 0) {
      emptyEl.style.display = 'block';
      content.style.display = 'none';
      return;
    }
    emptyEl.style.display = 'none';
    content.style.display = 'block';

    // Tally total units ordered per product id
    const tally = {};
    orders.forEach(function (o) {
      o.items.forEach(function (item) {
        tally[item.id] = (tally[item.id] || 0) + item.qty;
      });
    });

    // Build full list with order counts
    const all  = PRODUCTS.map(function (p) {
      return { id: p.id, name: p.name, count: tally[p.id] || 0 };
    });
    const top5 = all.slice().sort(function (a, b) { return b.count - a.count; }).slice(0, 5);
    const bot5 = all.slice().sort(function (a, b) { return a.count - b.count; }).slice(0, 5);

    function buildBars(list, colourClass) {
      if (list.every(function (x) { return x.count === 0; })) {
        return '<p style="color:var(--muted);font-size:0.85rem;padding:1rem 0">No orders yet for these products.</p>';
      }
      const localMax = Math.max.apply(null, list.map(function (x) { return x.count; }).concat([1]));
      return list.map(function (item, idx) {
        const pct  = Math.round((item.count / localMax) * 100);
        return `<div class="pop-bar-row">
          <div class="pop-bar-label-row">
            <span class="pop-rank">${idx + 1}</span>
            <span class="pop-name">${item.name}</span>
            <span class="pop-count">${item.count} sold</span>
          </div>
          <div class="pop-bar-track">
            <div class="pop-bar-fill ${colourClass}" style="width:${pct}%"></div>
          </div>
        </div>`;
      }).join('');
    }

    document.getElementById('pop-top5').innerHTML = buildBars(top5, 'pop-fill-gold');
    document.getElementById('pop-bot5').innerHTML = buildBars(bot5, 'pop-fill-blue');

  } catch (e) {
    console.error('[Popular Products] Render error:', e);
  }
}
