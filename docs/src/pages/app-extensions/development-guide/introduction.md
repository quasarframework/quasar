---
title: App Extension Development
desc: How to setup your machine for a Quasar App Extension development and getting started quickly.
scope:
  appExtensionTree:
    l: '.'
    e: PNPM workspace with /ae and /playground
    c:
      - l: ae
        e: The App Extension that you will publish
        c:
          - l: package.json
          - l: src
            c:
              - l: templates/
                e: optional folder for spawning files
              - l: runtime/
                e: optional folder with UI stuff
              - l: index.js
                e: (or .ts) Described in Index API
              - l: install.js
                e: (or .ts) Described in Install API
              - l: prompts.js
                e: (or .ts) Described in Prompts API
              - l: uninstall.js
                e: (or .ts) Described in Uninstall API
      - l: playground/
        e: A @quasar/app-vite project folder to test/develop with
---

This section of the docs deals with creating your own App Extensions.

It is assumed you have already installed one of the official App Extensions. Having this experience at your disposal is going to be very valuable when you start building your own App Extensions. If you run into problems, please visit our Discord server's channel `#app-extensions`.

An App Extension is essentially just an npm package that Quasar CLI loads to provide the functionality that you supplied.

## Creating the App Extension

```bash PNPM v11+ only!
pnpm create quasar@latest
# then pick the AppExtension option
```

It will prompt you about your specific needs. Do you need an install script, an uninstall script, will you be prompting the user with some questions? Pick only what you will be using. You can manually add these later if you decide otherwise.

For the sake of this documentation page, let's assume we answered with `my-ext` to the App Extension `ext-id` question (regarding the prompts above). Remember that the folder name for the App Extension source folder can be different from the actual `ext-id`. At the end, we will publish our new npm package (`quasar-app-extension-my-ext`) from the `/ae` folder.

Based on your responses, a folder for your App Extension will be created with the following structure:

<DocTree :def="scope.appExtensionTree" />

## App Extension Scripts description

Except for `/ae/src/index.js|ts`, all the other files are optional. You can manually add or remove them at any point in time.

| Name                   | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `/ae/src/prompts.js`   | Handles the prompts when installing the App Extension     |
| `/ae/src/install.js`   | Extends the installation procedure of the App Extension   |
| `/ae/src/index.js`     | Is executed on `quasar dev` and `quasar build`            |
| `/ae/src/uninstall.js` | Extends the uninstallation procedure of the App Extension |

## Handling package dependencies

If your App Extension needs packages at runtime, install them in the `/ae` folder as regular dependencies. Do not install packages supplied by Quasar CLI, such as `quasar`, `@quasar/extras`, or `@quasar/app-vite`. Use `api.compatibleWith()` in your install and index scripts to declare the versions that your extension supports; see the [Install API](/app-extensions/development-guide/install-api) and [Index API](/app-extensions/development-guide/index-api).

For example, if you are creating a UI component that depends on a package named `my-table`, run `pnpm add my-table` from the `/ae` folder.

::: warning
Never install packages that are supplied by Quasar CLI as dependencies of your extension. Use `api.compatibleWith()` to require a compatible version without installing a second copy.
:::

## Developing

### Commands to use

Notice `/package.json` scripts that you can use:

```bash Run from root folder
# Lint & format
# (if you selected oxlint + oxfmt option)
pnpm run lint
pnpm run lint:check

# Use playground to develop;
# Helps you test the Index script as well
pnpm run dev
pnpm run dev -m ssr
# ...etc

# Invokes the AE into /playground when needed
# (like when changing the scripts themselves);
# Helps you run the Install & Prompts scripts
pnpm run invoke

# Uninstall & re-install AE;
# Helps you mainly to run the Uninstall script
pnpm run cycle
```

### Install and Prompts scripts

::: tip
Learn more about what you can do with the [Prompts API](/app-extensions/development-guide/prompts-api) and the [Install API](/app-extensions/development-guide/install-api).
:::

You will notice mentions of `invoking` an AE. The invoking procedure, as opposed to the "adding" one, assumes that the App Extension's package is already pnpm/yarn/npm/bun installed into the host app (and so, Quasar CLI skips that step).

```bash End-user commands using Index script
quasar ext add <ext-id>
# or:
quasar ext invoke <ext-id>
```

### Uninstall script

::: tip
Learn more about what you can do with the [Uninstall API](/app-extensions/development-guide/uninstall-api).
:::

You will notice mentions of `uninvoking` an AE. Unlike removing an extension, uninvoking unregisters it from the host app but does not uninstall its package.

```bash End-user commands using Uninstall script
quasar ext remove <ext-id>
# or:
quasar ext uninvoke <ext-id>
```

### Index script

The Index script is the heart of your App Extension.

This is where you can tamper with all `quasar.config` file options, extend the Vite configuration, register Quasar CLI commands, start up external services required for developing your app and many more.

```bash End-user commands using Index script
quasar dev
quasar build
```

::: tip
Learn more about what you can do with the [Index API](/app-extensions/development-guide/index-api).
:::

A common use-case of what you can do with your Index script is to extend the host app's Vite config as follows:

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  api.extendViteConf((viteConf, { isClient, isServer }, api) => {
    // similar in use to /quasar.config > build > extendViteConf
  })
})
```

## Publishing

When you finalized your App Extension and you're ready to deploy it, all you need to do is to publish it to the npm repository.

- Make sure to edit `/ae/README.md`.
- Also edit `/ae/package.json` > `peerDependencies` if needed.
- In order to publish the AE, do it from within the `/ae` folder:

```bash
# from /ae folder ONLY:
pnpm login
pnpm publish
```

::: warning
It's important to remember to NOT strip out the `quasar-app-extension-` prefix from the `name` property of your extension's `/ae/package.json`, otherwise Quasar CLI will not recognize it.
:::
