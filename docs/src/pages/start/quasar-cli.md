---
title: Quasar CLI
desc: How to use the Quasar CLI, the premium developer experience for free.
---

Quasar CLI is the pride of Quasar Framework. You can seamlessly build:

- a SPA (Single Page Application/Website),
- a SSR (Server-side Rendered App/Website),
- a SSG (Static Site Generator App/Website),
- a PWA (Progressive Web App),
- a BEX (Browser Extensions),
- a Mobile App (through Cordova or Capacitor),
- an Electron App

...within the same project folder, ensuring you are **following the best Quasar practices while everything will simply work out of the box**.

## Trying Quasar CLI Online

You can try Quasar CLI online directly in the browser, without installing anything!
You will also be able to use the command line, so it will be almost identical to creating a project locally.

<q-btn no-wrap href="https://stackblitz.quasar.dev" target="_blank" label="Open in Stackblitz" />

## TL;DR

::: tip Requirements:

- Node.js v22+
- PNPM v11+ (recommended), Yarn v1 classic, NPM or Bun

:::

```tabs
<<| bash PNPM |>>
pnpm add -g @quasar/cli
pnpm create quasar@latest
<<| bash Yarn |>>
yarn global add @quasar/cli
yarn create quasar
<<| bash NPM |>>
npm i -g @quasar/cli
npm init quasar@latest
<<| bash Bun |>>
bun install -g @quasar/cli
bun create quasar@latest
```

Pick `App with Quasar CLI`.

<q-btn icon-right="launch" no-wrap label="View Components" to="/components" />

## Installation / Project Scaffolding

::: tip Requirements:

- Node.js v22+ for Quasar CLI.
- PNPM v11+ (recommended), Yarn v1 classic, NPM or Bun.

:::

1. Let's create a Quasar app:

   ```tabs
   <<| bash PNPM |>>
   pnpm create quasar@latest
   <<| bash Yarn |>>
   yarn create quasar
   <<| bash NPM |>>
   npm init quasar@latest
   <<| bash Bun |>>
   bun create quasar@latest
   ```

   ::: tip
   You may be presented with a confirmation to install the `create-quasar` package, press the enter key to confirm.
   :::

2. Pick the `App with Quasar CLI` option.

3. Answer the rest of the questions and you're almost done.

4. Now, do you want to be able to run Quasar CLI commands directly (eg. `quasar dev/build`) or through your package manager (`pnpm quasar dev/build` or `npx quasar dev/build`, etc)?

   We strongly recommend to pick the first choice and be able to run commands directly. Actually, you'll be able to do even more than just this (eg. "quasar upgrade" or "quasar serve" commands). For this, you'll need to globally install the `@quasar/cli` package:

   ```tabs
   <<| bash PNPM |>>
   pnpm add -g @quasar/cli
   <<| bash Yarn |>>
   yarn global add @quasar/cli
   <<| bash NPM |>>
   npm i -g @quasar/cli
   <<| bash Bun |>>
   bun install -g @quasar/cli
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
   Under Windows, modify user's PATH environment variable (search for "Edit environment variables for your account" in the Start Menu). If you are using yarn then add `%LOCALAPPDATA%\yarn\bin`, otherwise if you're using npm then add `%APPDATA%\npm`. Avoid using `setx` for this — it truncates the stored value to 1024 characters, which can permanently destroy part of your existing PATH.

   :::

   ::: tip WSL2
   Microsoft's recommended [Node.js development environment setup in WSL2](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2).

   When using WSL2 (Windows Subsystem for Linux) [Microsoft recommends](https://docs.microsoft.com/en-us/windows/wsl/compare-versions#performance-across-os-file-systems) keeping files in the linux file system to maximize performance. Projects will build around 3X slower and HMR (Hot Module Reload) will not work without a hack if the project files are on the Windows mount instead of the local linux file system. This is also true in Docker for Windows based development environments.
   :::

## How Quasar CLI works

Quasar CLI (`@quasar/cli`) works in tandem with `@quasar/app-vite`. The first one is optional (but **strongly recommended**) and allows you to run Quasar CLI commands directly and some other useful commands like `quasar upgrade` (upgrade Quasar packages seamlessly) or `quasar serve` (serve your distributable with an ad-hoc webserver). The second package is the heart of it (runs the important commands - dev, build, inspect, info, describe etc) and it gets installed locally into every Quasar project folder.

#### Running without the global @quasar/cli

However, should you want independence of the globally installed `@quasar/cli` package, you have the possibility to directly run the Quasar CLI commands. It is `@quasar/app-vite` (which is specific to each project folder) that will run all the CLI commands.

Here are the options:

1. You can write package.json scripts to run Quasar commands.

   Example of adding a few package.json scripts:

   ```js /package.json
   "scripts": {
     "dev": "quasar dev",
     "build": "quasar build",
     "build:pwa": "quasar build -m pwa"
   }
   ```

   <br>

   The above will allow you to run the scripts without the need of a globally installed `@quasar/cli`, should you wish to do so:

   ```tabs Running scripts
   <<| bash PNPM |>>
   pnpm run dev
   pnpm run build
   # ..etc
   <<| bash Yarn |>>
   yarn run dev
   yarn run build
   # ..etc
   <<| bash NPM |>>
   npm run dev
   npm run build
   # ..etc
   <<| bash Bun |>>
   bun run dev
   bun run build
   # ..etc
   ```

   <br>

2. Alternatively, you can directly run the Quasar CLI commands through your package manager:

   ```tabs
   <<| bash PNPM |>>
   pnpm quasar dev
   pnpm quasar inspect
   # ..etc
   <<| bash Yarn |>>
   yarn quasar dev
   yarn quasar inspect
   # ..etc
   <<| bash NPM |>>
   npx quasar dev
   npx quasar inspect
   # ..etc
   <<| bash Bun |>>
   bun quasar dev
   bun quasar inspect
   # ..etc
   ```

## What next?

<q-btn icon-right="launch" no-wrap label="View Components" to="/components" />
