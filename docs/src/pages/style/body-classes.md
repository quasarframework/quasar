---
title: Body classes
desc: Quasar's helper classes that get added to document.body.
---

Quasar attaches some very useful helper CSS classes to document.body which you can take advantage of:

| Name | Description |
| --- | --- |
| body--dark | When in [dark mode](/style/dark-mode) |
| body--light | When not in [dark mode](/style/dark-mode) |
| desktop | When client is on a desktop |
| mobile | When client is on a mobile device |
| touch | When client has touch support |
| no-touch | When client does NOT have touch support |
| platform-android | When client is on an Android device |
| platform-ios | When client is on an iOS device |
| native-mobile | When client is on a [Cordova](/quasar-cli/developing-cordova-apps/introduction) or [Capacitor](/quasar-cli/developing-capacitor-apps/introduction) app |
| electron | When client is on an [Electron](/quasar-cli/developing-electron-apps/introduction) app |
| bex | When app runs from a browser extension |
| within-iframe | When app runs from an iframe |
| `screen--*` | If [enabled (only)](/options/screen-plugin#how-to-enable-body-classes), tells current window breakpoint (`screen--xs`, `screen--sm`, ..., `screen--xl`) |
