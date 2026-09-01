# SDK reference

How to build a mini-app (a `.tapp`) for **Termal Studio**. The [examples](../examples/) are the
canonical, runnable reference; this page is the map. Full narrative guide:
**[termalos.com/developers](https://termalos.com/developers)**.

## Anatomy of an app

An app is a small folder with four files:

```
my-app/
  manifest.json   metadata + requested permissions
  app.html        markup for the window
  app.css         styles
  app.js          logic - exposes  function main(Termal) { ... }
```

`app.js` must expose a global `main(Termal)`. The `Termal` object passed in is the SDK: every
privileged call returns a Promise, so always `await` it (or use `.then`).

## `manifest.json`

```jsonc
{
  "key": "example-sdk-tour",         // unique id
  "name": "SDK Tour",                // display name
  "version": "1.0.0",
  "icon": { "type": "ti", "value": "ti-compass" },
  "color": "#c07cff",
  "window": { "w": 560, "h": 620 },  // initial window size
  "permissions": ["clipboard", "storage"],
  "defaultLang": "en",
  "langs": ["en"],
  "entry": "app.html"
}
```

Only declare the permissions you use; the user grants them. UI calls such as `toast`, `dialog`,
`menu` and `setTitle` need no permission.

## The `Termal` SDK, by example

Rather than a signature dump, read the example that owns each area - they are short and heavily
commented:

| Area | SDK surface | See |
|------|-------------|-----|
| UI (toast, dialogs, menu, clipboard, storage, title) | `Termal.toast`, `Termal.dialog.{alert,confirm,prompt}`, `Termal.menu`, `Termal.clipboard`, `Termal.storage`, `Termal.setTitle` | [`example-sdk-tour`](../examples/example-sdk-tour/) |
| Key/value storage | `Termal.storage.{set,get}` | [`example-notes`](../examples/example-notes/) |
| File picking &amp; opening on the desktop | user-granted file access | [`example-files`](../examples/example-files/) |
| Sandbox filesystem (read/write/list/delete) | app-scoped file API | [`example-text-editor`](../examples/example-text-editor/) |
| HTTP requests | local or server network exit | [`example-http-client`](../examples/example-http-client/) |
| Requests from the SSH server | server-side network exit | [`example-server-widget`](../examples/example-server-widget/) |
| Embedding websites | in-app web view | [`example-webview`](../examples/example-webview/) |
| Window control | size, maximize, resizable, title | [`example-window-options`](../examples/example-window-options/) |

## File access model

Access is user-granted: an app reaches a file or folder only after the user hands it over through a
picker, or within its own sandbox folder. Grants last for the app window's lifetime and are never
persisted. See [`example-files`](../examples/example-files/) and
[termalos.com/developers](https://termalos.com/developers).

---

> This reference is an overview and will grow. Found a gap or a bug in an example?
> Open an issue on the [organization](https://github.com/TermalOS).
