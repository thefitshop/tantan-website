/* ── Dashboard Security Tab ───────────────────────────────────────── */

var BLOCKED_BOTS_KEY = 'tantan_blocked_bots';

function renderSecurity() {
  try {
    var logs  = JSON.parse(localStorage.getItem(BLOCKED_BOTS_KEY) || '[]');
    var tbody = document.getElementById('sec-tbody');
    var empty = document.getElementById('sec-empty');
    var wrap  = document.getElementById('sec-table-wrap');
    var sumEl = document.getElementById('sec-summary');

    if (!tbody) return;

    // Summary cards
    if (sumEl) {
      var today = new Date().toDateString();
      var todayCount = logs.filter(function (l) {
        return new Date(l.time).toDateString() === today;
      }).length;

      sumEl.innerHTML =
        '<div class="pl-card" style="min-width:140px"><div class="pl-card-label">Total Blocked</div><div class="pl-card-value">' + logs.length + '</div></div>' +
        '<div class="pl-card" style="min-width:140px"><div class="pl-card-label">Blocked Today</div><div class="pl-card-value">' + todayCount + '</div></div>';
    }

    if (logs.length === 0) {
      if (wrap)  wrap.style.display  = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    if (wrap)  wrap.style.display  = '';
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = logs.map(function (entry, i) {
      var d   = entry.time ? new Date(entry.time) : null;
      var ts  = d ? d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
      var ua  = (entry.ua || '').slice(0, 120) + ((entry.ua || '').length > 120 ? '…' : '');
      return '<tr>' +
        '<td style="color:var(--muted);font-size:0.8rem">' + (i + 1) + '</td>' +
        '<td style="white-space:nowrap">' + ts + '</td>' +
        '<td>' + (entry.page || '—') + '</td>' +
        '<td><span style="background:rgba(220,38,38,0.1);color:#dc2626;padding:2px 8px;border-radius:20px;font-size:0.78rem">' + (entry.reason || 'ua-match') + '</span></td>' +
        '<td style="font-size:0.76rem;color:var(--muted);max-width:340px;word-break:break-all">' + ua + '</td>' +
        '</tr>';
    }).join('');

    // Clear button
    var clearBtn = document.getElementById('sec-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = function () {
        if (!confirm('Clear all ' + logs.length + ' blocked-bot log entries?')) return;
        localStorage.removeItem(BLOCKED_BOTS_KEY);
        renderSecurity();
      };
    }

  } catch (e) {
    console.error('[TanTan Dashboard] Security section failed:', e);
  }
}
