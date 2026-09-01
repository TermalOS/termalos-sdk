/* ============================================================================
 * Termal App Example - Window Options
 *
 * What it demonstrates
 *   Every window control an app has, plus opening a web view in a FIXED, mobile-sized
 *   window (dbnlink.com).
 *
 * Permissions   ["webview"]   - only "Open dbnlink" needs it. The win.* controls are free.
 * SDK methods   Termal.win.{setSize,maximize,restore,minimize,center,setResizable,setTitle},
 *               Termal.webview, Termal.toast
 *
 * ── INITIAL window options - declared in manifest.json ──
 *   "window": {
 *     "w": 460, "h": 700,        // starting size (px)
 *     "resizable":   true,       // false → no resize handle
 *     "maximizable": true,       // false → no maximize button, no double-click maximize
 *     "minimizable": true        // false → no minimize button
 *   }
 *
 * ── RUNTIME window options - the Termal.win.* API ──
 *   Termal.win.setSize(w, h)        resize now
 *   Termal.win.maximize()           fill the desktop
 *   Termal.win.restore()            back to normal size
 *   Termal.win.minimize()           send to the dock
 *   Termal.win.center()             center on screen
 *   Termal.win.setResizable(bool)   lock / unlock resizing
 *   Termal.win.setTitle(text)       rename the title bar
 *   Termal.win.close()              close the window
 *
 * ── A fixed mobile web view ──
 *   Termal.webview({ url, w, h, resizable:false, maximizable:false }) opens the site in a
 *   locked, phone-shaped window. At ~390px wide, responsive sites render their mobile layout.
 * ========================================================================== */

function main(Termal) {
  Termal.setTitle('Window Options');

  var acts = {
    mobile:        function () { Termal.win.setSize(390, 760); },
    desktop:       function () { Termal.win.setSize(900, 600); },
    center:        function () { Termal.win.center(); },
    maximize:      function () { Termal.win.maximize(); },
    restore:       function () { Termal.win.restore(); },
    minimize:      function () { Termal.win.minimize(); },
    'resizable-off': function () { Termal.win.setResizable(false); Termal.toast('Resizing locked', 'warn'); },
    'resizable-on':  function () { Termal.win.setResizable(true);  Termal.toast('Resizing enabled', 'success'); },
    title:         async function () {
      var name = await Termal.dialog.prompt('New window title', 'My Window');
      if (name) Termal.win.setTitle(name);
    },
    dbnlink: function () {
      // A separate, FIXED, phone-sized window - not resizable, not maximizable.
      Termal.webview({
        url: 'https://dbnlink.com/',
        title: 'dbnlink · mobile',
        w: 400, h: 780,          // phone-ish dimensions
        resizable: false,        // locked size
        maximizable: false,      // no maximize
        nav: false,              // no navigation bar - feels like an app
      });
    },
  };

  document.querySelectorAll('.wo-grid button').forEach(function (b) {
    b.onclick = function () {
      try { Promise.resolve(acts[b.dataset.act]()).catch(function (e) { Termal.toast(e.message, 'error'); }); }
      catch (e) { Termal.toast(e.message, 'error'); }
    };
  });
}
