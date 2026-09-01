/* ============================================================================
 * Termal App Example - HTTP Client
 *
 * What it demonstrates
 *   Making HTTP requests from an app, and the concept UNIQUE to Termal: choosing the
 *   network EXIT - either this machine, or the remote SSH server.
 *
 * Permissions   ["net"]
 * SDK methods   Termal.net.fetch(url, { exit, method }), Termal.toast
 *
 * exit: 'local'   → the request leaves from the machine running Termal (the host).
 * exit: 'server'  → the request is run FROM your SSH server (curl over the tunnel), so you
 *                   can reach things only that server can see. For safety, 'local' requests
 *                   are blocked from targeting private/internal addresses (anti-SSRF).
 *
 * Return shape   Termal.net.fetch resolves to { status, body }.
 * ========================================================================== */

function main(Termal) {
  var urlEl  = document.getElementById('hc-url');
  var metaEl = document.getElementById('hc-meta');
  var outEl  = document.getElementById('hc-out');

  function exit() {
    var r = document.querySelector('input[name="exit"]:checked');
    return r ? r.value : 'local';
  }

  async function send() {
    var url = urlEl.value.trim();
    if (!/^https?:\/\//i.test(url)) { Termal.toast('Enter an http(s) URL', 'warn'); return; }
    metaEl.textContent = 'Requesting via ' + exit() + '…';
    outEl.textContent = '';
    try {
      var res = await Termal.net.fetch(url, { exit: exit(), method: 'GET' });
      metaEl.textContent = 'HTTP ' + res.status + '  ·  exit: ' + exit() + '  ·  ' +
                           (res.body || '').length + ' bytes';
      // Pretty-print JSON when possible, otherwise show raw text.
      var body = res.body || '';
      try { body = JSON.stringify(JSON.parse(body), null, 2); } catch (_) {}
      outEl.textContent = body;
    } catch (e) {
      metaEl.textContent = '';
      outEl.textContent = 'Error: ' + e.message;
      Termal.toast('Request failed', 'error');
    }
  }

  document.getElementById('hc-go').onclick = send;
  urlEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
}
