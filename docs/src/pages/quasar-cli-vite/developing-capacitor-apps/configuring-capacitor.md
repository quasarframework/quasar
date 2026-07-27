---
title: Configuring Capacitor
desc: (@quasar/app-vite) How to manage your Capacitor apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
---

A Quasar Capacitor app has two configuration surfaces, each with a distinct job. The native Capacitor project lives under `/src-capacitor` and is configured by `capacitor.config.{ts,js}`. Quasar's own build/dev behavior is configured by the top-level `/quasar.config` file. We'll go over each.

## The capacitor.config file

`capacitor.config.{ts,js}` is Capacitor's own config file. The `/src-capacitor` folder is a Capacitor project, so for the schema itself and what each field does, see Capacitor's [Configuring your app](https://capacitorjs.com/docs/basics/configuring-your-app) docs.

The important mental model: this file is loaded by the Capacitor CLI process, not bundled by Vite. When Quasar runs `cap sync` (or similar) on your behalf, the cap CLI is a separate Node process that reads `capacitor.config.*` directly with `require()` (`.js`) or its TypeScript loader (`.ts`). Once that's in your head, the rest of the page is just consequences.

### File format

Quasar CLI looks for `capacitor.config.ts`, then `.js`. When you run `quasar mode add capacitor`, the scaffolded format depends on whether your project uses TypeScript:

- TS projects get `capacitor.config.ts`.
- JS projects get `capacitor.config.js` in CommonJS form.

Capacitor's `.js` config loader doesn't yet handle ESM exports correctly, so we have to stick with `module.exports` in JS projects.

### The defineCapacitorConfig helper

`@quasar/app-vite/capacitor` exports `defineCapacitorConfig`, a small wrapper for the `.ts` / `.js` forms. It does three things:

1. Defaults `webDir` to `'www'`. Quasar always builds to `src-capacitor/www`, so this avoids a field you'd otherwise have to remember to set. You can override it if you have a very custom use case.
2. In dev mode, injects `server.url` (and `server.cleartext: true` on Android) so the running native app loads from Quasar's dev server. You can override it if you have a very custom use case.
3. Types your input against `CapacitorConfig` from `@capacitor/cli`, so autocompletion and type errors come from the real upstream schema.

All of this happens at config-load time inside the cap CLI process. Your source file isn't mutated.

The helper accepts a plain object, a sync function, or an async function:

```tabs capacitor.config.ts
<<| ts Object (most common) |>>
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor';

export default defineCapacitorConfig({
  appId: 'org.example.app',
  appName: 'My App',
  plugins: {
    MyPlugin: { apiUrl: process.env.MY_API_URL }
  }
});
<<| ts Sync function |>>
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor';

export default defineCapacitorConfig(() => {
  const isDev = process.env.QUASAR_DEV === 'true';

  return {
    appId: 'org.example.app',
    appName: 'My App',
    plugins: {
      Analytics: { key: isDev ? process.env.STAGING_KEY : process.env.PROD_KEY }
    }
  };
});
<<| ts Async function |>>
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor';

export default defineCapacitorConfig(async () => {
  const response = await fetch('https://config.example.com/cap');
  if (!response.ok) {
    throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
  }
  const remoteConfig = await response.json();

  return {
    appId: 'org.example.app',
    appName: 'My App',
    plugins: remoteConfig.plugins
  };
});
```

The JS form is the same shape, just CommonJS:

```js /src-capacitor/capacitor.config.js
const { defineCapacitorConfig } = require('@quasar/app-vite/capacitor')

module.exports = defineCapacitorConfig({
  appId: 'org.example.app',
  appName: 'My App'
})
```

### Reading env values

When Quasar invokes the Capacitor CLI (through `quasar dev -m capacitor` or `quasar build -m capacitor`), it sets a handful of `QUASAR_*` environment variables on the spawned process. Your `capacitor.config.ts` / `.js` can read them through `process.env`. The names mirror the `import.meta.env.QUASAR_*` Vite defines available to your UI code:

| Variable            | Value                                                       |
| ------------------- | ----------------------------------------------------------- |
| `QUASAR_DEV`        | `'true'` in dev, `'false'` in build                         |
| `QUASAR_TARGET`     | `'android'` or `'ios'`                                      |
| `QUASAR_APP_URL`    | Dev server URL (only meaningful in dev)                     |
| `QUASAR_MODE`       | `'capacitor'`                                               |
| `QUASAR_*` (others) | Anything else Quasar exposes via `import.meta.env.QUASAR_*` |

Your `.env` files and `quasar.config > build.env` values are forwarded the same way (subject to Quasar's prefix configuration, see [Handling import.meta.env](/quasar-cli-vite/handling-import-meta-env)). So if your `.env` has `SENTRY_DSN=https://...`, the config file reads it directly:

```ts /src-capacitor/capacitor.config.ts
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor'

export default defineCapacitorConfig({
  appId: 'org.example.app',
  appName: 'My App',
  plugins: {
    Sentry: { dsn: process.env.SENTRY_DSN } // [!code highlight]
  }
})
```

There is one type quirk to internalize because of the loading model. In UI code, `import.meta.env.QUASAR_DEV` is inlined by Vite as the actual boolean `true` or `false`. In `capacitor.config.ts` / `.js` you're reading `process.env.X`, which is always a string. So the same name carries a different type on each side, and the strings `'true'` and `'false'` are both truthy:

```ts
// UI code (Vite-bundled)
if (import.meta.env.QUASAR_DEV) {
  /* runs in dev */
} // [!code highlight]

// capacitor.config.ts (loaded by cap CLI as plain Node)
if (process.env.QUASAR_DEV) {
  /* always runs by mistake! */
} // [!code error]
if (process.env.QUASAR_DEV === 'true') {
  /* runs in dev */
} // [!code highlight]
```

Same goes for `QUASAR_PROD`, `QUASAR_CLIENT`, `QUASAR_SERVER`, and any other boolean-shaped flag. Plain string values like `QUASAR_TARGET` behave the way you'd expect.

### Running cap directly

If you run the Capacitor CLI yourself from `/src-capacitor` (`npx cap sync`, `npx cap doctor`, or an IDE-triggered sync), Quasar isn't in the loop to populate the environment. The file still loads, `defineCapacitorConfig` still defaults `webDir`, and static fields still work. But anything that reads `process.env.QUASAR_*` or your own `.env` file values comes back `undefined`, because nothing put them there. Code defensively if a config branch matters in that path.

### appId and appName

`appId` and the app display name are captured once via prompts when you run `quasar mode add capacitor`, and written into the scaffolded `capacitor.config.*`. The Capacitor CLI then bakes them into the native projects at platform-add time (`cap add android` / `cap add ios`). It writes `appName` into `ios/App/App/Info.plist > CFBundleDisplayName` and `android/app/src/main/res/values/strings.xml > app_name`.

`cap sync` and `cap copy` don't re-run that step. So changing `appId` or `appName` in `capacitor.config.*` after the platforms exist doesn't propagate to existing native projects. To rename the installed app, edit Info.plist and strings.xml directly, or remove and re-add the platform. This is how Capacitor works in general, not a Quasar-specific quirk.

## quasar.config file

Quasar-specific Capacitor options live in the top-level `/quasar.config` file. These are about Quasar's build/dev behavior, not Capacitor's native config (which belongs in `capacitor.config.*`).

```ts /quasar.config file
return {
  capacitor: {
    /**
     * Automatically hide the Capacitor Splashscreen when app is ready,
     * (is using the Splashscreen Capacitor plugin).
     *
     * @default true
     */
    hideSplashscreen?: boolean;

    /**
     * Preparation params with which the Capacitor CLI is called
     *
     * @default [ 'sync', ctx.targetName ]
     */
    capacitorCliPreparationParams?: string[];
  }
}
```

And you can also configure:

```ts /quasar.config file
return {
  framework: {
    config: {
      capacitor: {
        iosStatusBarPadding?: boolean, // add the dynamic top padding on iOS mobile devices
        androidStatusBarPadding?: boolean // account for Android safe areas (default: true)
      }
    }
  }
}
```

Finally, you can also disable or configure the back button hook (used for Dialogs):

```js /quasar.config file
return {
  framework: {
    config: {
      capacitor: {
        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true / false / '*' / ['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true / false
      }
    }
  }
}
```

Should you want to tamper with the Vite config for UI in /src:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf) {
        if (ctx.mode.capacitor) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```
