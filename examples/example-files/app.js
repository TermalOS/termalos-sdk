/* ============================================================================
 * Termal App Example - File Explorer
 *
 * What it demonstrates
 *   The MEDIATED file access model. An app has no free access to the server: it asks
 *   for a picker, the user chooses, and ONLY that path (a folder's whole tree, or a
 *   single file) becomes reachable. The user's choice IS the permission.
 *
 * Permissions   ["fs.read"]
 * SDK methods   Termal.dialog.openFile, Termal.dialog.openFolder,
 *               Termal.fs.list, Termal.fs.read, Termal.open.path, Termal.toast
 *
 * Note the two-step nature of a folder:
 *   openFolder() returns an absolute path AND grants read access to its whole subtree.
 *   fs.list(absolutePath) then works on it - whereas a random absolute path the app made
 *   up would be refused ("path not granted"). That refusal is the security model working.
 * ========================================================================== */

function main(Termal) {
  var body   = document.getElementById('fx-body');
  var status = document.getElementById('fx-status');

  function setStatus(t) { status.textContent = t; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function base(p) { return String(p).split('/').pop(); }
  function fmtSize(n) {
    if (n == null) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }

  // ── Open a single file: pick it, read it, show a preview ──────────────────
  document.getElementById('fx-open-file').onclick = async function () {
    var path = await Termal.dialog.openFile({ title: 'Choose a file to preview' });
    if (!path) return;                       // user cancelled
    setStatus(path);
    var text;
    try {
      text = await Termal.fs.read(path);     // allowed: this exact path was just granted
    } catch (e) {
      body.innerHTML = '<div class="fx-hint">Could not read this file: ' + esc(e.message) + '</div>';
      return;
    }
    body.innerHTML =
      '<div class="fx-file"><div class="fx-file-h">' + esc(base(path)) +
      ' <span class="fx-muted">(' + text.length + ' chars)</span></div>' +
      '<pre class="fx-pre">' + esc(text.slice(0, 20000)) + '</pre></div>';
  };

  // ── Open a folder: pick it, list it, click to open items in the desktop ───
  document.getElementById('fx-open-folder').onclick = async function () {
    var dir = await Termal.dialog.openFolder({ title: 'Choose a folder to browse' });
    if (!dir) return;
    setStatus(dir);
    await listFolder(dir);
  };

  async function listFolder(dir) {
    var entries;
    try {
      entries = await Termal.fs.list(dir);   // allowed: the folder tree was granted
    } catch (e) {
      body.innerHTML = '<div class="fx-hint">Could not list this folder: ' + esc(e.message) + '</div>';
      return;
    }
    entries.sort(function (a, b) {
      var d = (b.type === 'dir') - (a.type === 'dir');
      return d || a.name.localeCompare(b.name);
    });
    if (!entries.length) { body.innerHTML = '<div class="fx-hint">This folder is empty.</div>'; return; }

    body.innerHTML =
      '<div class="fx-path">' + esc(dir) + '</div>' +
      '<div class="fx-list">' + entries.map(function (e) {
        var isDir = e.type === 'dir';
        var icon = isDir ? '📁' : '📄';
        return '<div class="fx-item" data-name="' + esc(e.name) + '" data-dir="' + (isDir ? '1' : '') + '">' +
          '<span class="fx-ic">' + icon + '</span>' +
          '<span class="fx-name">' + esc(e.name) + '</span>' +
          '<span class="fx-sz">' + (isDir ? '' : fmtSize(e.size)) + '</span></div>';
      }).join('') + '</div>';

    Array.prototype.forEach.call(body.querySelectorAll('.fx-item'), function (el) {
      el.onclick = function () {
        var full = (dir.replace(/\/+$/, '')) + '/' + el.getAttribute('data-name');
        if (el.getAttribute('data-dir')) {
          listFolder(full);                  // descend (still inside the granted tree)
        } else {
          // Hand the file to the desktop: it opens with the right app (image viewer,
          // editor, archive…). The app never has to know how to render it.
          Termal.open.path(full).catch(function (e) { Termal.toast(e.message, 'error'); });
        }
      };
    });
  }
}
