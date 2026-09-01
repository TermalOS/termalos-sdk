/* ============================================================================
 * Termal App Example - Notes & Todo
 *
 * What it demonstrates
 *   Persisting an app's whole state as a single value with key/value storage.
 *   No files, no server calls - just Termal.storage.
 *
 * Permissions   ["storage"]
 * SDK methods   Termal.storage.get, Termal.storage.set, Termal.toast
 *
 * Pattern       Keep the state in memory, and after every change write the entire array
 *               back with storage.set(). storage holds JSON-serialisable values directly
 *               (arrays/objects), so there's nothing to stringify yourself.
 * ========================================================================== */

function main(Termal) {
  var listEl  = document.getElementById('td-list');
  var countEl = document.getElementById('td-count');
  var items = []; // [{ text, done }]

  function render() {
    listEl.innerHTML = '';
    items.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'td-item' + (it.done ? ' done' : '');
      li.innerHTML = '<input type="checkbox"' + (it.done ? ' checked' : '') + '>' +
                     '<span class="td-text"></span>' +
                     '<button class="td-x" title="Remove">×</button>';
      li.querySelector('.td-text').textContent = it.text; // textContent = no HTML injection
      li.querySelector('input').onclick = function () { it.done = !it.done; save(); render(); };
      li.querySelector('.td-x').onclick  = function () { items.splice(i, 1); save(); render(); };
      listEl.appendChild(li);
    });
    var left = items.filter(function (x) { return !x.done; }).length;
    countEl.textContent = items.length + ' items · ' + left + ' left';
  }

  function save() { Termal.storage.set('todos', items); } // persist the whole array

  document.getElementById('td-form').onsubmit = function (e) {
    e.preventDefault();
    var input = document.getElementById('td-input');
    var text = input.value.trim();
    if (!text) return;
    items.push({ text: text, done: false });
    input.value = '';
    save(); render();
    Termal.toast('Added', 'success');
  };

  // Boot: load saved todos (default to an empty list).
  (async function () {
    items = (await Termal.storage.get('todos', [])) || [];
    render();
  })();
}
