/* ── Dashboard Security Tab — real-time polling ───────────────────── */

var BLOCKED_BOTS_KEY  = 'tantan_blocked_bots';
var _secPollTimer     = null;
var _secLastCount     = -1;   // -1 = first load, so we don't highlight everything as "new"
var _secPollInterval  = 3000; // ms between checks

/* ── Main render ──────────────────────────────────────────────────── */
function renderSecurity() {
  try {
    var logs  = JSON.parse(localStorage.getItem(BLOCKED_BOTS_KEY) || '[]');
    var tbody = document.getElementById('sec-tbody');
    var empty = document.getElementById('sec-empty');
    var wrap  = document.getElementById('sec-table-wrap');
    var sumEl = document.getElementById('sec-summary');
    var dot   = document.getElementById('sec-live-dot');
    var ts    = document.getElementById('sec-last-checked');

    if (!tbody) return;

    var isFirstLoad = (_secLastCount === -1);
    var newEntries  = isFirstLoad ? 0 : Math.max(0, logs.length - _secLastCount);

    // ── Pulse the live dot on every poll tick ──
    if (dot) {
      dot.classList.remove('sec-dot-pulse');
      void dot.offsetWidth;          // force reflow so animation restarts
      dot.classList.add('sec-dot-pulse');
    }

    // ── Update "last checked" clock ──
    if (ts) {
      ts.textContent = 'Last checked ' + new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }

    // ── Summary cards ──
    if (sumEl) {
      var today      = new Date().toDateString();
      var todayCount = logs.filter(function (l) {
        return l.time && new Date(l.time).toDateString() === today;
      }).length;

      sumEl.innerHTML =
        '<div class="pl-card" style="min-width:150px">' +
          '<div class="pl-card-label">Total Blocked</div>' +
          '<div class="pl-card-value">' + logs.length + '</div>' +
        '</div>' +
        '<div class="pl-card" style="min-width:150px">' +
          '<div class="pl-card-label">Blocked Today</div>' +
          '<div class="pl-card-value">' + todayCount + '</div>' +
        '</div>' +
        (newEntries > 0
          ? '<div class="pl-card" style="min-width:150px;border-color:rgba(220,38,38,0.25)">' +
              '<div class="pl-card-label" style="color:#dc2626">New Since Last View</div>' +
              '<div class="pl-card-value" style="color:#dc2626">+' + newEntries + '</div>' +
            '</div>'
          : '');
    }

    // ── Empty state ──
    if (logs.length === 0) {
      if (wrap)  wrap.style.display  = 'none';
      if (empty) empty.style.display = 'block';
      _secLastCount = 0;
      return;
    }
    if (wrap)  wrap.style.display  = '';
    if (empty) empty.style.display = 'none';

    // ── Only re-render rows when the count changes (prevents flicker) ──
    if (logs.length !== _secLastCount) {
      tbody.innerHTML = logs.map(function (entry, idx) {
        var d      = entry.time ? new Date(entry.time) : null;
        var stamp  = d
          ? d.toLocaleDateString('en-GB') + ' ' +
            d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : '—';
        var ua     = (entry.ua || '—');
        var uaShow = ua.length > 110 ? ua.slice(0, 110) + '…' : ua;
        var isNew  = !isFirstLoad && idx < newEntries;

        return '<tr class="' + (isNew ? 'sec-row-new' : '') + '">' +
          '<td style="color:var(--muted);font-size:0.8rem">' + (idx + 1) + '</td>' +
          '<td style="white-space:nowrap">' + stamp + '</td>' +
          '<td>' + (entry.page || '—') + '</td>' +
          '<td>' +
            '<span class="sec-reason-tag">' + (entry.reason || 'ua-match') + '</span>' +
          '</td>' +
          '<td class="sec-ua-cell" title="' + ua.replace(/"/g, '&quot;') + '">' + uaShow + '</td>' +
          '</tr>';
      }).join('');
    }

    _secLastCount = logs.length;

    // ── Clear button ──
    var clearBtn = document.getElementById('sec-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = function () {
        if (!confirm('Clear all ' + logs.length + ' blocked-bot log entr' + (logs.length === 1 ? 'y' : 'ies') + '?')) return;
        localStorage.removeItem(BLOCKED_BOTS_KEY);
        _secLastCount = -1;
        renderSecurity();
      };
    }

  } catch (e) {
    console.error('[TanTan Dashboard] Security section failed:', e);
  }
}

/* ── Polling — only re-renders when the Security panel is visible ── */
function startSecurityPolling() {
  stopSecurityPolling();
  renderSecurity();                                   // immediate first paint
  _secPollTimer = setInterval(function () {
    var panel = document.getElementById('panel-security');
    if (panel && panel.classList.contains('active')) {
      renderSecurity();
    }
  }, _secPollInterval);
}

function stopSecurityPolling() {
  if (_secPollTimer) {
    clearInterval(_secPollTimer);
    _secPollTimer = null;
  }
}
