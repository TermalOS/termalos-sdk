/* ============================================================================
 * Termal App Example - SDK Tour
 *
 * What it demonstrates
 *   A single button for each SDK call, so you can see - and copy - how every API is used.
 *
 * Permissions   ["clipboard", "storage"]
 *               dialog / menu / toast / setTitle need NO permission.
 * SDK methods   Termal.toast, Termal.dialog.{alert,confirm,prompt}, Termal.menu,
 *               Termal.clipboard.write, Termal.storage.{set,get}, Termal.setTitle
 *
 * Pattern       Every privileged call returns a Promise - always `await` it (or `.then`).
 * ========================================================================== */

function main(Termal) {
  var logEl = document.getElementById('log');
  function log(line) { logEl.textContent += line + '\n'; logEl.scrollTop = logEl.scrollHeight; }

  var actions = {
    toast: function () {
      Termal.toast('This is a toast', 'success');
      log('toast("This is a toast", "success")');
    },
    alert: async function () {
      await Termal.dialog.alert('Hello from your app!');
      log('dialog.alert() → dismissed');
    },
    confirm: async function () {
      var ok = await Termal.dialog.confirm('Do you like Termal?', 'Yes');
      log('dialog.confirm() → ' + ok);
    },
    prompt: async function () {
      var name = await Termal.dialog.prompt('What is your name?', 'Ada');
      log('dialog.prompt() → ' + JSON.stringify(name));
    },
    menu: async function () {
      // Context menu at a fixed point; each item can carry a `value`.
      var choice = await Termal.menu(180, 180, [
        { label: 'Copy',  icon: 'ti-copy',  value: 'copy' },
        { label: 'Share', icon: 'ti-share', value: 'share' },
        { sep: true },
        { label: 'Delete', icon: 'ti-trash', danger: true, value: 'delete' },
      ]);
      log('menu() → ' + JSON.stringify(choice));
    },
    clip: async function () {
      await Termal.clipboard.write('Copied by the SDK Tour app 🎉');
      log('clipboard.write() → text is now in the OS clipboard');
      Termal.toast('Copied - paste it anywhere', 'success');
    },
    set: async function () {
      var n = (await Termal.storage.get('clicks', 0)) + 1;
      await Termal.storage.set('clicks', n);
      log('storage.set("clicks", ' + n + ') - persists across restarts');
    },
    get: async function () {
      var n = await Termal.storage.get('clicks', 0);
      log('storage.get("clicks") → ' + n);
    },
    title: function () {
      Termal.setTitle('SDK Tour · ' + new Date().toLocaleTimeString());
      log('setTitle() → window title updated');
    },
    clear: function () { logEl.textContent = ''; },
  };

  document.querySelectorAll('.grid button').forEach(function (b) {
    b.onclick = function () {
      try { Promise.resolve(actions[b.dataset.act]()).catch(function (e) { log('ERROR: ' + e.message); }); }
      catch (e) { log('ERROR: ' + e.message); }
    };
  });

  log('Ready. Manifest permissions: ' + JSON.stringify(Termal.manifest.permissions));
}
