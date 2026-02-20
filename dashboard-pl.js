/* ============================================
   TANTAN — Profit & Loss Section
   Edit ONLY this file for P&L changes.
   ============================================ */

function renderPL() {
  try {
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

  } catch (e) {
    console.error('[P&L] Render error:', e);
  }
}
