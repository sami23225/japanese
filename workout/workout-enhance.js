/* workout-enhance.js — turns the static plan into an interactive trainer.
   - Start workout -> focus mode that steps through every exercise (warm-up,
     circuit rounds, finisher), one at a time, with per-set weight/reps logging
     and a rest timer.
   - Videos are surfaced inline (see workout-theme.css) — no longer collapsed.
   - Progress + logged sets persist to localStorage and sync via a private code.
   Reads the page's own DAYS data + renderDay(). Load with:
     <script src="workout-enhance.js" defer></script> */
(function () {
  'use strict';
  if (window.__workoutTrainer) return; window.__workoutTrainer = true;

  var SB_URL = 'https://hhzggarfpslftqwvjuiq.supabase.co';
  var SB_KEY = 'sb_publishable_hFR9bHl_kWaP9i0WlQogYA_KtawEs0U';
  var SKEY = 'workout_state', CODEK = 'workout_sync_code', TSK = 'workout_sync_ts';
  var REST = 75; // seconds

  function $(t, css, html) { var e = document.createElement(t); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function toast(m) { try { if (window.toast) return window.toast(m); } catch (e) {} }

  function loadState() { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch (e) { return {}; } }
  function state() { var s = loadState(); s.logs = s.logs || {}; s.done = s.done || {}; s.sessions = s.sessions || {}; s.streak = s.streak || 0; return s; }
  function saveState(s) { s.updated = new Date().toISOString(); localStorage.setItem(SKEY, JSON.stringify(s)); schedulePush(); }

  /* ---------------- sync ---------------- */
  function rpc(fn, body) {
    return fetch(SB_URL + '/rest/v1/rpc/' + fn, {
      method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.text().then(function (t) { var j = t ? JSON.parse(t) : null; if (!r.ok) throw new Error((j && j.message) || r.status); return j; }); });
  }
  function getCode() { return (localStorage.getItem(CODEK) || '').trim(); }
  function genCode() { var a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', b = new Uint8Array(20); crypto.getRandomValues(b); var s = ''; for (var i = 0; i < 20; i++) { s += a[b[i] % a.length]; if (i % 5 === 4 && i < 19) s += '-'; } return 'wk-' + s; }
  var pushT, pushing, again;
  function schedulePush() { if (!getCode()) return; clearTimeout(pushT); pushT = setTimeout(pushNow, 1400); }
  function pushNow() {
    var code = getCode(); if (!code) return Promise.resolve();
    if (pushing) { again = true; return Promise.resolve(); }
    pushing = true; setDot('sync');
    return rpc('workout_save', { p_code: code, p_data: loadState() })
      .then(function (ts) { if (typeof ts === 'string') localStorage.setItem(TSK, ts); setDot('ok'); })
      .catch(function () { setDot('err'); }).then(function () { pushing = false; if (again) { again = false; schedulePush(); } });
  }
  function pull(opts) {
    opts = opts || {}; var code = getCode(); if (!code) return Promise.resolve();
    return rpc('workout_load', { p_code: code }).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : rows;
      if (!row || !row.data) { if (opts.seed) return pushNow(); return; }
      var serverTs = row.updated_at || '', localTs = localStorage.getItem(TSK) || '';
      if (opts.force || (serverTs && serverTs !== localTs && (!localTs || serverTs > localTs))) {
        if (opts.confirm && !confirm('Load your saved workout progress from the cloud? This replaces what’s on this device.')) return;
        localStorage.setItem(SKEY, JSON.stringify(row.data)); localStorage.setItem(TSK, serverTs);
        return { applied: true };
      }
    });
  }

  /* ---------------- data ---------------- */
  function activeIdx() { var t = [].slice.call(document.querySelectorAll('.day-tab')); var i = t.findIndex(function (x) { return x.classList.contains('active'); }); return i < 0 ? 0 : i; }
  function parseRounds(label) { var m = (label || '').match(/(\d+)\s*rounds?/i); return m ? +m[1] : 1; }
  function buildSteps(day) {
    var steps = [];
    (day.sections || []).forEach(function (sec) {
      var rounds = parseRounds(sec.label);
      for (var r = 1; r <= rounds; r++) (sec.exercises || []).forEach(function (ex) { steps.push({ sec: sec.label, round: r, rounds: rounds, ex: ex }); });
    });
    return steps;
  }
  function embed(url) { if (!url) return null; var m = url.match(/[?&]v=([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/) || url.match(/embed\/([\w-]+)/); return m ? 'https://www.youtube.com/embed/' + m[1] : url; }

  /* ---------------- Start button on the day hero ---------------- */
  function augment() {
    var hero = document.querySelector('.day-hero'); if (!hero || hero.querySelector('.wk-start')) return;
    var b = $('button', '', '<i class="wk-i">▶</i> Start workout'); b.className = 'wk-start';
    b.onclick = openSession;
    hero.appendChild(b);
  }

  /* ---------------- focus-mode session ---------------- */
  var sess = null;
  function openSession() {
    var day = (typeof DAYS !== 'undefined') ? DAYS[activeIdx()] : null; if (!day) return;
    var steps = buildSteps(day); if (!steps.length) return;
    sess = { day: day, steps: steps, i: 0, resting: false };
    var ov = $('div'); ov.id = 'wk-focus'; document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    renderStep();
  }
  function closeSession(finished) {
    var ov = document.getElementById('wk-focus'); if (ov) ov.remove();
    document.body.style.overflow = ''; sess = null;
  }
  function stepKey(st) { return sess.day.id + '|' + st.ex.name + '|' + st.round; }
  function renderStep() {
    var ov = document.getElementById('wk-focus'); if (!ov || !sess) return;
    var st = sess.steps[sess.i], ex = st.ex, s = state();
    var prev = s.logs[stepKey(st)] || lastLog(ex.name) || {};
    var vid = embed(ex.video);
    var pct = Math.round((sess.i) / sess.steps.length * 100);
    ov.innerHTML =
      '<div class="wk-head">' +
        '<button class="wk-x" aria-label="Close">✕</button>' +
        '<div class="wk-prog"><i style="width:' + pct + '%"></i></div>' +
        '<span class="wk-count">' + (sess.i + 1) + ' / ' + sess.steps.length + '</span>' +
      '</div>' +
      '<div class="wk-body">' +
        '<div class="wk-sec">' + esc(st.sec.replace(/\s+[—–-]\s+.*$/, '')) + (st.rounds > 1 ? ' · round ' + st.round + ' of ' + st.rounds : '') + '</div>' +
        '<div class="wk-name">' + esc(ex.name) + '</div>' +
        '<div class="wk-meta">' + esc(ex.equip || '') + (ex.sets ? ' · ' + esc(ex.sets) : '') + '</div>' +
        (vid ? '<div class="wk-vid"><div class="wk-vwrap" data-src="' + esc(vid) + '"><div class="wk-play">▶ Watch form</div></div></div>' : '') +
        (ex.tip ? '<div class="wk-tip"><b>Cue</b> ' + esc(ex.tip) + '</div>' : '') +
        '<div class="wk-log">' +
          '<label>Weight<input class="wk-w" type="number" inputmode="decimal" placeholder="kg" value="' + (prev.w != null ? esc(prev.w) : '') + '"></label>' +
          '<label>Reps<input class="wk-r" type="number" inputmode="numeric" placeholder="reps" value="' + (prev.reps != null ? esc(prev.reps) : '') + '"></label>' +
        '</div>' +
      '</div>' +
      '<div class="wk-foot">' +
        (sess.i > 0 ? '<button class="wk-prev">←</button>' : '<span></span>') +
        '<button class="wk-done">' + (sess.i === sess.steps.length - 1 ? 'Finish workout' : 'Log set · rest') + '</button>' +
      '</div>';
    ov.querySelector('.wk-x').onclick = function () { closeSession(); };
    var pv = ov.querySelector('.wk-prev'); if (pv) pv.onclick = function () { sess.i--; renderStep(); };
    ov.querySelector('.wk-done').onclick = logAndNext;
    var vw = ov.querySelector('.wk-vwrap'); if (vw) vw.querySelector('.wk-play').onclick = function () { vw.innerHTML = '<iframe class="wk-iframe" src="' + vw.getAttribute('data-src') + '?rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'; };
  }
  function lastLog(name) { var s = state(), best = null; Object.keys(s.logs).forEach(function (k) { if (k.split('|')[1] === name) { var v = s.logs[k]; if (!best || (v.ts > best.ts)) best = v; } }); return best; }
  function logAndNext() {
    var ov = document.getElementById('wk-focus'), st = sess.steps[sess.i], s = state();
    var w = parseFloat(ov.querySelector('.wk-w').value), r = parseInt(ov.querySelector('.wk-r').value, 10);
    s.logs[stepKey(st)] = { w: isNaN(w) ? null : w, reps: isNaN(r) ? null : r, ts: Date.now() };
    s.done[stepKey(st)] = true; saveState(s);
    if (sess.i === sess.steps.length - 1) return finishSession();
    restThen(function () { sess.i++; renderStep(); });
  }
  function restThen(next) {
    var ov = document.getElementById('wk-focus'); if (!ov) return next();
    var left = REST, nextEx = sess.steps[sess.i + 1];
    ov.querySelector('.wk-body').innerHTML =
      '<div class="wk-rest"><div class="wk-restlbl">Rest</div><div class="wk-clock">' + fmt(left) + '</div>' +
      (nextEx ? '<div class="wk-next">Next · ' + esc(nextEx.ex.name) + '</div>' : '') +
      '<button class="wk-skip">Skip rest →</button></div>';
    var footBtn = ov.querySelector('.wk-done'); if (footBtn) footBtn.style.visibility = 'hidden';
    var t = setInterval(function () { left--; var c = ov.querySelector('.wk-clock'); if (!c) { clearInterval(t); return; } c.textContent = fmt(left); if (left <= 0) { clearInterval(t); next(); } }, 1000);
    ov.querySelector('.wk-skip').onclick = function () { clearInterval(t); next(); };
  }
  function fmt(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function finishSession() {
    var s = state(), sets = 0, vol = 0;
    sess.steps.forEach(function (st) { var v = s.logs[stepKey(st)]; if (v && v.reps) { sets++; vol += (v.w || 0) * v.reps; } });
    var today = new Date().toISOString().slice(0, 10);
    s.sessions[sess.day.id + '|' + today] = { day: sess.day.name, sets: sets, vol: Math.round(vol), date: today };
    if (s.lastDate !== today) { s.streak = (s.lastDate && daysBetween(s.lastDate, today) === 1) ? s.streak + 1 : 1; s.lastDate = today; }
    saveState(s);
    var ov = document.getElementById('wk-focus');
    ov.querySelector('.wk-body').innerHTML =
      '<div class="wk-summary"><div class="wk-check">✓</div><div class="wk-done-t">Workout complete</div>' +
      '<div class="wk-stats"><div><b>' + sets + '</b><span>sets</span></div><div><b>' + Math.round(vol).toLocaleString() + '</b><span>kg volume</span></div><div><b>' + s.streak + '</b><span>day streak</span></div></div></div>';
    ov.querySelector('.wk-foot').innerHTML = '<span></span><button class="wk-done">Done</button>';
    ov.querySelector('.wk-x').onclick = ov.querySelector('.wk-done').onclick = function () { closeSession(true); };
  }
  function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

  /* ---------------- sync button ---------------- */
  var dot;
  function setDot(x) { if (!dot) return; dot.style.background = { ok: '#31EFB8', sync: '#EF9F27', err: '#E24B4A', off: '#8A90AE' }[x] || '#8A90AE'; }
  function syncUI() {
    var btn = $('button'); btn.id = 'wk-sync'; btn.innerHTML = '<span id="wk-dot"></span> Sync'; document.body.appendChild(btn);
    dot = btn.querySelector('#wk-dot'); setDot(getCode() ? 'ok' : 'off');
    btn.onclick = function () {
      var p = document.getElementById('wk-syncp'); if (p) { p.remove(); return; }
      p = $('div'); p.id = 'wk-syncp'; var code = getCode();
      p.innerHTML = code
        ? '<b>Cloud sync is on</b><p>Keep this code private — it restores your logs on any device.</p><div class="wk-coderow"><input readonly value="' + esc(code) + '"><button class="wk-copy">Copy</button></div><button class="wk-backup wk-full">Back up now</button>'
        : '<b>Save your workout progress</b><p>Turn on sync to back up, or enter a code from another device.</p><button class="wk-on wk-full">Turn on sync</button><div class="wk-coderow"><input class="wk-in" placeholder="wk-XXXXX-..."><button class="wk-restore">Restore</button></div>';
      document.body.appendChild(p);
      var q = function (s) { return p.querySelector(s); };
      if (q('.wk-copy')) q('.wk-copy').onclick = function () { navigator.clipboard && navigator.clipboard.writeText(code); toast('Code copied'); };
      if (q('.wk-backup')) q('.wk-backup').onclick = function () { pushNow().then(function () { toast('Backed up'); }); };
      if (q('.wk-on')) q('.wk-on').onclick = function () { localStorage.setItem(CODEK, genCode()); pushNow(); setDot('ok'); p.remove(); btn.click(); };
      if (q('.wk-restore')) q('.wk-restore').onclick = function () { var v = q('.wk-in').value.trim(); if (v.length < 8) return toast('Enter your full code'); localStorage.setItem(CODEK, v); pull({ force: true, confirm: true }).then(function (r) { if (r && r.applied) { toast('Restored'); location.reload(); } else toast('No data for that code'); }); };
    };
  }

  /* ---------------- init ---------------- */
  function init() {
    if (typeof window.renderDay === 'function' && !window.renderDay.__wk) {
      var orig = window.renderDay; window.renderDay = function () { var r = orig.apply(this, arguments); setTimeout(augment, 0); return r; }; window.renderDay.__wk = true;
    }
    augment(); syncUI();
    if (getCode()) pull({}).then(function (r) { if (r && r.applied && !sessionStorage.getItem('wk_pulled')) { sessionStorage.setItem('wk_pulled', '1'); location.reload(); } setDot('ok'); }).catch(function () { setDot('err'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
