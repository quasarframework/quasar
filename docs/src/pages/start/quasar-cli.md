---
title: Quasar CLI
desc: How to use the Quasar CLI, the premium developer experience for free.
---

Quasar CLI is the pride of Quasar Framework. You can seamlessly build:

* a SPA (Single Page Application/Website),
* a SSR (Server-side Rendered App/Website),
* a PWA (Progressive Web App),
* a BEX (Browser Extensions),
* a Mobile App (through Cordova),
* an Electron App

...within the same project folder, ensuring you are **following the best Quasar practices while everything will simply work out of the box**.

## TL;DR

```bash
$ yarn global add @quasar/cli
$ yarn create quasar

# or:

$ npm i -g @quasar/cli
$ npm init quasar

# or:

$ pnpm global add @quasar/cli
$ pnpm dx create-quasar
```

<q-btn color="brand-primary" no-caps no-wrap push label="Go to User Interface Components" to="/vue-components" />

## Installation / Project Scaffolding

1. Let's create a Quasar app:

    ```bash
    $ yarn create quasar
    # or:
    $ npm init quasar
    # or:
    $ pnpm dx create-quasar
    ```
    <br>

2. Pick the `App with Quasar CLI` option then `Quasar v2`.

3. You will then be asked which Quasar App CLI you want. Do you prefer the Vite one or the Webpack one?

4. Answer the rest of the questions and you're almost done.

5. Now, do you want to be able to run Quasar CLI commands directly (eg. `$ quasar dev/build`) or through yarn or npx (`$ yarn quasar dev/build` / `npx quasar dev/build`)?

    We strongly recommend to pick the first choice and be able to run commands directly. Actually, you'll be able to do even more than just this (eg. "quasar upgrade" or "quasar serve" commands). For this, you'll need to globally install the `@quasar/cli` package:

    ```bash
    $ yarn global add @quasar/cli
    # or
    $ npm install -g @quasar/cli
    # or
    $ pnpm global add @quasar/cli
    ```

    ::: tip
    If you are using Yarn, make sure that the Yarn [global install location](https://yarnpkg.com/lang/en/docs/cli/global/) is in your PATH:
    <br><br>

    ```bash
    # in ~/.bashrc or equivalent
    export PATH="$(yarn global bin):$PATH"

    # for fish-shell:
    set -U fish_user_paths (yarn global bin) $fish_user_paths
    ```
    <br>
    Under Windows, modify user's PATH environment variable. If you are using yarn then add `%LOCALAPPDATA%\yarn\bin`, otherwise if you're using npm then add `%APPDATA%\npm`.
    :::

    ::: tip WSL2
    Microsoft's recommended [Nodejs development environment setup in WSL2](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2).

    When using WSL2 (Windows Subsystem for Linux) [Microsoft recommends](https://docs.microsoft.com/en-us/windows/wsl/compare-versions#performance-across-os-file-systems) keeping files in the linux file system to maximize performance. Projects will build around 3X slower and HMR (Hot Module Reload) will not work without a hack if the project files are on the Windows mount instead of the local linux file system. This is also true in Docker for Windows based development environments.
    :::

## How Quasar CLI works

Quasar CLI (`@quasar/cli`) works in tandem with either `@quasar/app-vite` or `@quasar/app-webpack`. The first one is optional (but strongly recommended) and allows you to run Quasar CLI commands directly and some other useful commands like `quasar upgrade` (upgrade Quasar packages seamlessly) or `quasar serve` (serve your distributable with an ad-hoc webserver). The second package is the heart of it (runs the important commands - dev, build, inspect, info, describe etc) and it gets installed locally into every Quasar project folder.

However, should you want independence of the globally installed `@quasar/cli` package, you can write npm scripts (in your `package.json`) to run Quasar commands. It is `@quasar/app-vite` or `@quasar/app-webpack` (which is specific to each project folder) that will run all the CLI commands.

Example of adding a few npm scripts into your `package.json`:

```js
// package.json
"scripts": {
  "dev": "quasar dev",
  "build": "quasar build",
  "build:pwa": "quasar build -m pwa"
}
```

The above will allow you to run `$ yarn dev` or `$ yarn build` without the need of a globally installed `@quasar/cli`, should you wish to do so.

Alternatively, you can even use [npx](https://github.com/npm/npx) to run quasar commands without the need of a globally installed `@quasar/cli`.

```bash
$ npx quasar dev
```

## What next?

<q-btn color="brand-primary" no-caps no-wrap push label="Go to User Interface Components" to="/vue-components" />
