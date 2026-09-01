/* ============================================================================
 * Termal App Example - Web View
 *
 * What it demonstrates
 *   Embedding a real, COOKIE-CAPABLE web view inside your own app window.
 *
 * Permissions   ["webview"]
 * SDK methods   Termal.setTitle, Termal.webview, Termal.dialog.alert
 *
 * Why Termal.webview and not a plain <iframe>?
 *   A third-party app runs in a sandboxed iframe (opaque origin). Any <iframe> you put
 *   inside it CANNOT read or set cookies / localStorage - so a site that needs a login or
 *   session simply won't work. Termal.webview() opens a real Electron <webview> on a
 *   PERSISTENT partition, so cookies and sessions behave exactly like a normal browser.
 *
 *   embed: true  → the webview takes over THIS app window (instead of opening a new one).
 *   exit: 'server' (optional) would route the traffic through your SSH server.
 * ========================================================================== */

function main(Termal) {
  Termal.setTitle('8bitForge');

  Termal.webview({
    url: 'https://8bitforge.8binami.app/?mode=guest',
    embed: true,   // render inside this window - cookies/session work here
    nav: true,     // small back / forward / reload bar
  }).catch(function (e) {
    Termal.dialog.alert('Could not open the web view: ' + e.message);
  });
}
