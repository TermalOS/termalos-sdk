# Example apps

Every example app that ships with **Termal Studio**, ready to read, run and adapt.
All of them are released under the [MIT License](../LICENSE).

Each app is a folder with four files:

| File | Role |
|------|------|
| `manifest.json` | App metadata: name, icon, window size, requested permissions, entry point. |
| `app.html` | The markup loaded in the app window. |
| `app.css` | Styles. |
| `app.js` | Logic. Exposes `function main(Termal) { ... }`; the `Termal` object is the SDK. |

## The apps

| App | Folder | What it shows |
|-----|--------|---------------|
| **SDK Tour** | [`example-sdk-tour`](example-sdk-tour/) | One button per API: toast, dialog, menu, clipboard, storage. Start here. |
| **File Explorer** | [`example-files`](example-files/) | Let the user pick a file or folder, list it, and open items on the desktop. |
| **Text Editor** | [`example-text-editor`](example-text-editor/) | Read, write, list and delete files in the app's sandbox folder. |
| **Notes &amp; Todo** | [`example-notes`](example-notes/) | Persist the whole app state with key/value storage. |
| **HTTP Client** | [`example-http-client`](example-http-client/) | Make HTTP requests through a local or server network exit. |
| **Server Widget** | [`example-server-widget`](example-server-widget/) | Poll a URL from your SSH server, with auto-refresh. |
| **Web View** | [`example-webview`](example-webview/) | Embed a website inside your app, and open a full webview window. |
| **Window Options** | [`example-window-options`](example-window-options/) | Size, maximize, resizable and title, plus a fixed mobile web view. |

## Run one

1. Open **Termal Studio** inside Termal OS.
2. Click **Examples** in the toolbar and pick one - or create a new project and paste the four files.
3. Run it, read the comments, make it yours.

Full developer overview: **[termalos.com/developers](https://termalos.com/developers)**.
