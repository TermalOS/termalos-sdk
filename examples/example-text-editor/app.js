/* ============================================================================
 * Termal App Example - Text Editor
 *
 * What it demonstrates
 *   Reading, writing, listing and deleting real files, plus a "last opened" memory.
 *
 * Permissions   ["fs.read", "fs.write", "clipboard", "storage"]
 * SDK methods   Termal.fs.{list,read,write,remove}, Termal.dialog.prompt,
 *               Termal.dialog.confirm, Termal.clipboard.write, Termal.storage.{get,set},
 *               Termal.toast
 *
 * IMPORTANT - sandboxed file access
 *   Termal.fs is SCOPED to this app's own private data folder. Paths are relative:
 *   `Termal.fs.write('note.txt', ...)` writes inside the app sandbox, never anywhere else
 *   on the server. `..` is rejected. This is the safe model - an app can't touch other
 *   apps' or the user's files.
 * ========================================================================== */

function main(Termal) {
  var area   = document.getElementById('ed-area');
  var sel    = document.getElementById('ed-files');
  var status = document.getElementById('ed-status');
  var current = null; // name of the file currently open

  function setStatus(txt) { status.textContent = txt; }

  async function refreshList(selectName) {
    var entries = await Termal.fs.list('');            // list the app's data folder
    var names = entries.filter(function (e) { return e.type === 'file'; })
                       .map(function (e) { return e.name; }).sort();
    sel.innerHTML = '<option value="">- open a file -</option>' +
      names.map(function (n) { return '<option value="' + n + '">' + n + '</option>'; }).join('');
    if (selectName) sel.value = selectName;
  }

  async function open(name) {
    if (!name) return;
    var text = await Termal.fs.read(name);
    area.value = text;
    current = name;
    setStatus(name);
    await Termal.storage.set('lastFile', name);        // remember for next launch
  }

  async function save() {
    if (!current) {
      var name = await Termal.dialog.prompt('File name', 'note.txt');
      if (!name) return;
      current = name;
    }
    await Termal.fs.write(current, area.value);         // create or overwrite
    await refreshList(current);
    setStatus('saved · ' + current);
    Termal.toast('Saved ' + current, 'success');
  }

  document.getElementById('ed-new').onclick = function () {
    area.value = ''; current = null; sel.value = ''; setStatus('new file');
    area.focus();
  };
  sel.onchange = function () { open(sel.value); };
  document.getElementById('ed-save').onclick = save;

  document.getElementById('ed-copy').onclick = async function () {
    await Termal.clipboard.write(area.value);
    Termal.toast('Copied to clipboard', 'success');
  };

  document.getElementById('ed-del').onclick = async function () {
    if (!current) return Termal.toast('No file open', 'warn');
    if (!(await Termal.dialog.confirm('Delete "' + current + '"?', 'Delete'))) return;
    await Termal.fs.remove(current);                    // remove the file
    area.value = ''; var gone = current; current = null;
    await refreshList();
    setStatus('deleted ' + gone);
  };

  // Ctrl/Cmd+S saves.
  area.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); save(); }
  });

  // Boot: list files and reopen the last one, if any.
  (async function () {
    await refreshList();
    var last = await Termal.storage.get('lastFile', '');
    if (last) { try { await open(last); } catch (_) {} }
  })();
}
