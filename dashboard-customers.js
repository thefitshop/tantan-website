/* ============================================
   TANTAN — Customers Section
   Edit ONLY this file for customer changes.
   ============================================ */

function renderCustomers() {
  try {
    const orders    = getOrders();
    const tbody     = document.getElementById('customers-tbody');
    const empty     = document.getElementById('customers-empty');
    const noResults = document.getElementById('customers-no-results');
    const wrap      = document.getElementById('customers-table-wrap');
    const countEl   = document.getElementById('customer-count');
    const searchEl  = document.getElementById('cust-search');
    const map       = {};

    orders.forEach(function (o) {
      const key = ((o.customer && (o.customer.email || o.customer.name)) || 'unknown').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          name:       (o.customer && o.customer.name)     || '—',
          email:      (o.customer && o.customer.email)    || '—',
          phone:      (o.customer && o.customer.phone)    || '—',
          address:    (o.customer && o.customer.address)  || '',
          city:       (o.customer && o.customer.city)     || '',
          postcode:   (o.customer && o.customer.postcode) || '',
          orders:     0,
          totalSpent: 0,
          lastOrder:  null,
          productMap: {}
        };
      }
      map[key].orders++;
      map[key].totalSpent += o.total;
      const d = new Date(o.date);
      if (!map[key].lastOrder || d > new Date(map[key].lastOrder)) map[key].lastOrder = o.date;

      o.items.forEach(function (item) {
        const pname = item.name || ('Product #' + item.id);
        map[key].productMap[pname] = (map[key].productMap[pname] || 0) + item.qty;
      });
    });

    const allCustomers = Object.values(map).sort(function (a, b) { return b.totalSpent - a.totalSpent; });
    countEl.textContent = `${allCustomers.length} customer${allCustomers.length !== 1 ? 's' : ''}`;

    if (allCustomers.length === 0) {
      wrap.style.display      = 'none';
      empty.style.display     = 'block';
      noResults.style.display = 'none';
      searchEl.style.display  = 'none';
      return;
    }
    empty.style.display    = 'none';
    searchEl.style.display = 'block';

    function renderRows(customers) {
      if (customers.length === 0) {
        wrap.style.display      = 'none';
        noResults.style.display = 'block';
        return;
      }
      wrap.style.display      = 'block';
      noResults.style.display = 'none';

      tbody.innerHTML = customers.map(function (c) {
        const last = c.lastOrder
          ? new Date(c.lastOrder).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';
        const addrParts = [c.address, c.city, c.postcode].filter(Boolean);
        const addrStr   = addrParts.length
          ? addrParts.join(', ')
          : '<span style="color:var(--muted)">—</span>';
        const productLines = Object.entries(c.productMap)
          .sort(function (a, b) { return b[1] - a[1]; })
          .map(function (entry) {
            return `<span class="cust-product-tag">${entry[0]} <strong>×${entry[1]}</strong></span>`;
          }).join('');

        return `<tr>
          <td>
            <strong>${c.name}</strong><br>
            <span class="cust-detail">${c.email}</span><br>
            <span class="cust-detail">${c.phone}</span>
          </td>
          <td class="cust-detail">${addrStr}</td>
          <td><div class="cust-product-list">${productLines || '<span style="color:var(--muted)">—</span>'}</div></td>
          <td style="text-align:center;font-weight:700">${c.orders}</td>
          <td><strong>${fmt(c.totalSpent)}</strong></td>
          <td class="cust-detail">${last}</td>
        </tr>`;
      }).join('');
    }

    renderRows(allCustomers);

    searchEl.oninput = function () {
      const q = searchEl.value.toLowerCase().trim();
      if (!q) { renderRows(allCustomers); return; }
      renderRows(allCustomers.filter(function (c) {
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      }));
    };

  } catch (e) {
    console.error('[Customers] Render error:', e);
  }
}
