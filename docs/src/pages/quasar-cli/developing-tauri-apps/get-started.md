---
title: Get Started
desc: Start making Tauri Apps with Quasar.
---

In this guide, we assume you have already installed all prerequisites:

- node >= 10.16.3
- npm >= 6.6.0
- yarn >= 1.17.3
- rustc >= 1.37.0 (don't use nightly)
- rustup >= 1.18.3

If your system does not immediately work, please visit the [**Tauri** Environment Documentation](https://tauri.quasar.dev/docs/environment). 

::: warning Toolchain Safety
If you are concerned about changing your working environment (eg from Node 8LTS to 10LTS), please know that any versions of node, yarn and npm below those listed here are indeed vulnerable to a range of attacks and our underlying philosophy with **Tauri** is that we prohibit the use of vulnerable components in any part of its tooling. If your CI is not compatible with our minimums, then we urge you to contact your vendor to help you become safer.
:::

## Tauri dev command
Using **Tauri** is simple:
```bash
$ quasar create shiny-tauri-app
$ cd shiny-tauri-app
$ quasar dev -m tauri
```

This will create your app and open a webview that is rigged for HMR. Under the hood it installs the `@quasar/tauri` npm module, installs dependencies and creates files in your repository from the template. The first time it runs, it will build all Rust crates - and this may take a little time, but it will never be needed again until your dependencies change.

If you want to use the version of **Tauri** without a localhost server, add a section to your quasar.conf.js like this:
```
module.exports = function (ctx) {
  return {
    tauri: {
      embeddedServer: { active: false },
      whitelist: {
        // all: true // uncomment this line to enable all API
      },
      window: {
        title: 'Quasar Tauri App set by quasar.conf.js'
      }
    },
```

## Tauri build command

```
$ quasar build -m tauri
```

The final build asset will be found here:
```
/src-tauri/target/release/bundle/
```

That's it. 

If you have had any problems with this getting started guide, please visit the [Tauri Documentation](https://tauri.quasar.dev/docs).
