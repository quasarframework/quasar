---
title: App Extension Runtime Files
desc: How to author the consumer-runtime code shipped by a Quasar App Extension (components, composables, boot files) and how to expose entrypoints via package.json exports.
---

This page refers to the `src/runtime/` directory of a Quasar App Extension (AE). Code placed here runs in the browser context of the host Quasar app once the AE is installed.

::: warning
The `src/runtime/` directory and the `package.json > exports` setup described below are currently scaffolded only by the TypeScript AE template. Support in the JavaScript template is planned for a future release.
:::

Typical contents:

- A Vue component, directive, or plugin.
- Plain JS/TS code such as constants, composables, utilities, or services.
- A Quasar boot file that the AE registers from its Index script.

The runtime directory is published as part of the npm package and consumed directly by the host app's bundler (Vite). Source files can stay as raw `.ts` or `.vue`; the AE itself does not require a build step.

## Default exports layout

The AE template's `package.json` includes a wildcard `exports` entry that exposes every file under `./src/runtime/` without extra configuration:

```json
{
  "exports": {
    ".": "./src/runtime/index.ts",
    "./*": "./src/runtime/*"
  }
}
```

With this in place:

- `import { x } from 'quasar-app-extension-my-ext'` resolves to `src/runtime/index.ts`.
- `import { y } from 'quasar-app-extension-my-ext/some-folder/file'` resolves to `src/runtime/some-folder/file.ts` (Vite handles the extension).

## The main entry

Use `src/runtime/index.ts` to declare the AE's public exports. Re-export the components, composables, and types that host apps should be able to import from your package's root:

```ts
import MyButton from './components/MyButton.vue'

declare module 'vue' {
  interface GlobalComponents {
    MyButton: typeof MyButton
  }
}

export { MyButton }
```

The `declare module 'vue'` block gives consumers IDE auto-complete for globally-registered components.

## Adding more entrypoints

For a dedicated subpath like `quasar-app-extension-my-ext/another`, the default `./*` mapping already covers it. Add the file:

```
src/runtime/another.ts
```

For finer control, add an explicit entry to `package.json > exports`. Typical reasons: specifying a different export condition, exposing a type-only entry, or overriding the wildcard's resolution:

```json
{
  "exports": {
    "./another": "./src/runtime/another.ts"
  }
}
```

## Boot files

Boot files placed under `./src/runtime/boot/` are reachable automatically through the `./*` wildcard. A boot file at `./src/runtime/boot/register.ts` is available as `quasar-app-extension-my-ext/boot/register`.

Optionally, add an explicit `exports` entry to document the entrypoint or to override the wildcard's resolution:

```json
{
  "exports": {
    "./boot/register": "./src/runtime/boot/register.ts"
  }
}
```

Register the boot file from the AE's Index script (`src/index.ts`) with `extendQuasarConf`:

```ts
import type { IndexAPI } from '@quasar/app-vite'

export default function (api: IndexAPI) {
  api.extendQuasarConf(conf => {
    conf.boot!.push('~quasar-app-extension-my-ext/boot/register')
  })
}
```

The `~` prefix tells the Quasar CLI to resolve the path as a package subpath rather than as a project-local file.

::: tip
See the [Index API](/app-extensions/development-guide/index-api) for the full reference on `extendQuasarConf` and the other hooks available from the Index script.
:::
