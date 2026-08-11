---
title: Live Updates
desc: (@quasar/app-vite) How to enable live updates for a Quasar hybrid mobile app with Capacitor.
---

Live Updates, also known as Over-the-Air (OTA) or hot code updates, are a way to push updates to your app without going through the app store review process. This is particularly useful for bug fixes or minor updates that don't require a full app release.

::: warning
A live-update bundle is executable application code. Use only an update service and plugin configuration that verifies the authenticity and integrity of downloaded bundles, protect publishing credentials, and test rollback behavior. Restrict updates to web assets; native code, plugins, permissions, and other binary changes require a signed store release. Confirm that your update policy complies with the requirements of every store where the app is distributed.

OTA updates must comply with the rules of every target store and must not replace native code, native dependencies, permissions, or behavior that requires store review. Review the current Apple, Google Play, and plugin-provider requirements before enabling live updates in production.
:::

## Capgo

[Capgo](https://capgo.app/) provides the open-source `@capgo/capacitor-updater` plugin. It supports both a free self-hosted workflow and a managed cloud service.

### Installation

Navigate to the Capacitor project directory and install the plugin:

```bash
cd src-capacitor
```

```tabs
<<| bash PNPM |>>
pnpm add @capgo/capacitor-updater
<<| bash Yarn |>>
yarn add @capgo/capacitor-updater
<<| bash NPM |>>
npm install @capgo/capacitor-updater
<<| bash Bun |>>
bun add @capgo/capacitor-updater
```

Then synchronize the native projects:

```bash
npx cap sync
```

### Configuration

For a self-hosted manual update flow, disable automatic updates in your `capacitor.config` file. This keeps the update decision in your application code while you host the update bundle and metadata on your own infrastructure.

```ts /src-capacitor/capacitor.config.ts
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor'

export default defineCapacitorConfig({
  plugins: {
    CapacitorUpdater: {
      autoUpdate: 'off'
    }
  }
})
```

After configuring the plugin, synchronize the Capacitor project again:

```bash
npx cap sync
```

### Usage

Call [`notifyAppReady()`](https://capgo.app/docs/plugins/updater/api/#notifyappready) after the application has loaded successfully. This confirms that the current bundle works and prevents an unnecessary rollback.

```js
import { CapacitorUpdater } from '@capgo/capacitor-updater'

await CapacitorUpdater.notifyAppReady()
```

In manual mode, your application checks your own update endpoint, downloads the bundle, and decides when to activate it. The following example expects the endpoint to return `version`, `url`, and `checksum` fields:

```js
import { CapacitorUpdater } from '@capgo/capacitor-updater'

const sync = async () => {
  const response = await fetch('https://example.com/api/mobile-update')

  if (!response.ok) return

  const update = await response.json()

  if (!update?.url || !update?.version || !update?.checksum) return

  const bundle = await CapacitorUpdater.download({
    url: update.url,
    version: update.version,
    checksum: update.checksum
  })

  await CapacitorUpdater.next({ id: bundle.id })
}
```

The downloaded bundle will be used on the next application start. To apply it immediately after your own confirmation UI or maintenance screen, reload the application:

```js
await CapacitorUpdater.reload()
```

### Publishing updates

Return to the Quasar project root and create the Capacitor web bundle:

```bash
quasar build -m capacitor -T [android|ios] --skip-pkg
```

Then use the Capgo CLI to create a bundle archive from `src-capacitor/www`:

```bash
npx @capgo/cli@latest bundle zip [appId] --path src-capacitor/www --json
```

Upload the generated archive to your HTTPS server or storage bucket. Your update endpoint should return its metadata:

```json
{
  "version": "1.0.1",
  "url": "https://example.com/mobile-updates/1.0.1.zip",
  "checksum": "sha256-checksum-returned-by-the-capgo-cli"
}
```

Replace `[appId]` with the application ID from your Capacitor configuration. The archive must contain `index.html` at its root. The Capgo CLI handles the expected bundle structure and returns the checksum used to verify the download. See the [Capgo self-hosted documentation](https://capgo.app/docs/plugins/updater/self-hosted/getting-started/) for the complete server workflow.

If you do not want to maintain the update API, storage, channels, rollbacks, and analytics yourself, the same plugin can use the managed [Capgo Cloud](https://capgo.app/) service.

## Capawesome Cloud

[Capawesome Live Update](https://capawesome.io/plugins/live-update/) provides a managed update workflow through Capawesome Cloud.

### Installation

To enable Live Updates in your Quasar Capacitor app, you need to install the `@capawesome/capacitor-live-update` plugin. First, navigate to your Capacitor project directory:

```bash
cd src-capacitor
```

Then, install the plugin:

```tabs
<<| bash PNPM |>>
pnpm add @capawesome/capacitor-live-update
<<| bash Yarn |>>
yarn add @capawesome/capacitor-live-update
<<| bash NPM |>>
npm install @capawesome/capacitor-live-update
<<| bash Bun |>>
bun add @capawesome/capacitor-live-update
```

After that, you need to sync the changes with your native projects:

```bash
npx cap sync
```

### Configuration

Next, you need to configure the plugin to work with [Capawesome Cloud](https://cloud.capawesome.io/).

#### App ID

In order for your app to identify itself to Capawesome Cloud, you need to set the `appId` in your `capacitor.config` file. For this, you need to create an app on the [Capawesome Cloud Console](https://console.cloud.capawesome.io/) and get the App ID.

```ts /src-capacitor/capacitor.config.ts
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor'

export default defineCapacitorConfig({
  plugins: {
    LiveUpdate: {
      appId: '00000000-0000-0000-0000-000000000000'
    }
  }
})
```

Replace `00000000-0000-0000-0000-000000000000` with your actual App ID from the Capawesome Cloud Console.

After configuring the App ID, sync your Capacitor project again:

```bash
npx cap sync
```

### Usage

The most basic usage of the Live Update plugin is to call the [`sync(...)`](https://capawesome.io/plugins/live-update/#sync) method when the app starts. This method checks for updates, downloads them if available, and sets them as the next bundle to be applied. You can then call the [`reload()`](https://capawesome.io/plugins/live-update/#reload) method to apply the update immediately. If the [`reload()`](https://capawesome.io/plugins/live-update/#reload) method is not called, the new bundle will be used on the next app start.

```js
import { LiveUpdate } from '@capawesome/capacitor-live-update'

const sync = async () => {
  const result = await LiveUpdate.sync()
  if (result.nextBundleId) {
    await LiveUpdate.reload()
  }
}
```

### Publishing updates

To publish your first update, you need to [create a bundle](https://capawesome.io/cloud/live-updates/bundles/#create-a-bundle) on Capawesome Cloud. For this, you need a bundle artifact. A bundle artifact is the build output of your web app. In Quasar, this is the `src-capacitor/www` folder. You can create a bundle artifact by running the following command:

```bash
quasar build -m capacitor -T [android|ios] --skip-pkg
```

This will create a `src-capacitor/www` folder with the build output of your web app. You can then upload this folder to Capawesome Cloud using the [Capawesome CLI](https://capawesome.io/cloud/cli/).
To install the Capawesome CLI, run the following command:

```tabs
<<| bash PNPM |>>
pnpm add -g @capawesome/cli
<<| bash Yarn |>>
yarn global add @capawesome/cli
<<| bash NPM |>>
npm i -g @capawesome/cli
<<| bash Bun |>>
bun install -g @capawesome/cli
```

After installing the Capawesome CLI, log in to your Capawesome Cloud account and follow the prompts:

```bash
capawesome login
```

Once you are logged in, you can create a bundle by running the following command:

```bash
capawesome apps:bundles:create --path src-capacitor/www
```

Congratulations! You have successfully published your first live update. You can now test it by running your app on a device or emulator. The app will check for updates and apply them if available.
Feel free to check out the [documentation](https://capawesome.io/plugins/live-update/) of the Live Update plugin to see what else you can do with it.
