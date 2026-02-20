/* ============================================
   TANTAN — Orders Section
   Edit ONLY this file for orders changes.
   ============================================ */

function renderOrders() {
  try {
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

    // Status dropdowns — onchange per select (no accumulation)
    tbody.querySelectorAll('.status-select').forEach(function (sel) {
      sel.onchange = function () {
        const s = getStatuses();
        s[sel.dataset.orderId] = sel.value;
        saveStatuses(s);
        sel.className = 'status-select s-' + sel.value;
      };
    });

  } catch (e) {
    console.error('[Orders] Render error:', e);
  }
}
