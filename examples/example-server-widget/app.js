/* ============================================================================
 * Termal App Example - Server Widget
 *
 * What it demonstrates
 *   The thing that makes Termal apps special: talking to the REMOTE SSH SERVER.
 *   This widget polls a URL with `exit: 'server'`, so the request runs on the server and
 *   can reach services only IT can see (e.g. http://127.0.0.1/health on the server itself).
 *
 * Permissions   ["net", "storage"]
 * SDK methods   Termal.net.fetch(url, { exit: 'server' }), Termal.storage.{get,set},
 *               Termal.toast
 *
 * Pattern       A poll loop you can turn on/off, with the last-used URL remembered across
 *               launches. Clear the timer whenever you stop auto-refresh. (When the window
 *               is closed the whole app is destroyed, so any running timer stops with it.)
 * ========================================================================== */

function main(Termal) {
  var urlEl    = document.getElementById('sw-url');
  var statusEl = document.getElementById('sw-status');
  var outEl    = document.getElementById('sw-out');
  var dotEl    = document.getElementById('sw-dot');
  var autoEl   = document.getElementById('sw-auto');
  var timer = null;

  async function poll() {
    var url = urlEl.value.trim();
    if (!/^https?:\/\//i.test(url)) { Termal.toast('Enter an http(s) URL', 'warn'); return; }
    await Termal.storage.set('lastUrl', url); // remember it
    statusEl.textContent = 'polling ' + url + ' via server…';
    try {
      var res = await Termal.net.fetch(url, { exit: 'server' }); // <-- runs on the SSH server
      dotEl.className = 'sw-dot ok';
      statusEl.textContent = 'HTTP ' + res.status + '  ·  ' + new Date().toLocaleTimeString();
      var body = res.body || '';
      try { body = JSON.stringify(JSON.parse(body), null, 2); } catch (_) {}
      outEl.textContent = body;
    } catch (e) {
      dotEl.className = 'sw-dot err';
      statusEl.textContent = 'error · ' + new Date().toLocaleTimeString();
      outEl.textContent = e.message;
    }
  }

  function setAuto(on) {
    if (timer) { clearInterval(timer); timer = null; }
    if (on) { poll(); timer = setInterval(poll, 10000); } // every 10s
  }

  document.getElementById('sw-refresh').onclick = poll;
  autoEl.onchange = function () { setAuto(autoEl.checked); };

  // Boot: restore the last URL used.
  (async function () {
    var last = await Termal.storage.get('lastUrl', '');
    if (last) urlEl.value = last;
  })();
}
