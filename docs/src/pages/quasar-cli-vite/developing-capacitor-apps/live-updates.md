---
title: Live Updates
desc: (@quasar/app-vite) How to enable live updates for a Quasar hybrid mobile app with Capacitor.
---

Live Updates, also known as Over-the-Air (OTA) or hot code updates, are a way to push updates to your app without going through the app store review process. This is particularly useful for bug fixes or minor updates that don't require a full app release.

> [!CAUTION]
> A live-update bundle is executable application code. Use only an update service and plugin configuration that verifies the authenticity and integrity of downloaded bundles, protect publishing credentials, and test rollback behavior. Restrict updates to web assets; native code, plugins, permissions, and other binary changes require a signed store release. Confirm that your update policy complies with the requirements of every store where the app is distributed.
>
> OTA updates must comply with the rules of every target store and must not replace native code, native dependencies, permissions, or behavior that requires store review. Review the current Apple, Google Play, and plugin-provider requirements before enabling live updates in production.

## Capgo

[Capgo](https://capgo.app/) provides the open-source `@capgo/capacitor-updater` plugin. It supports both a free self-hosted workflow and a managed cloud service.

### Capgo Installation

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

### Capgo Configuration

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

### Capgo Usage

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

### Capgo Publishing updates

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

The [Capawesome Live Update](https://capawesome.io/docs/sdks/capacitor/live-update/) plugin is open source and can download bundles from any URL. [Capawesome Cloud](https://capawesome.io/docs/cloud/live-updates/) is the managed service that adds channels, gradual rollouts, automatic rollbacks, and code signing on top of it. This guide uses Capawesome Cloud.

### Capawesome Installation

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

> [!NOTE]
> The latest plugin version requires Capacitor 8. For Capacitor 7, install `@capawesome/capacitor-live-update@v7-lts`; for Capacitor 6, install `@capawesome/capacitor-live-update@v6-lts`.

If you submit to the App Store, add the plugin's entry to your iOS [privacy manifest](https://capawesome.io/docs/sdks/capacitor/live-update/#privacy-manifest).

### Capawesome Configuration

Next, you need to configure the plugin to work with Capawesome Cloud. Create an app in the [Capawesome Cloud Console](https://console.cloud.capawesome.io/) and copy its App ID. Then set the `appId` in your `capacitor.config` file, together with the recommended settings:

```ts /src-capacitor/capacitor.config.ts
import { defineCapacitorConfig } from '@quasar/app-vite/capacitor'

export default defineCapacitorConfig({
  plugins: {
    LiveUpdate: {
      appId: '00000000-0000-0000-0000-000000000000',
      autoUpdateStrategy: 'background',
      autoBlockRolledBackBundles: true,
      readyTimeout: 10000
    }
  }
})
```

Replace `00000000-0000-0000-0000-000000000000` with your actual App ID from the Capawesome Cloud Console. The App ID is not the same as the app identifier (e.g. `com.example.app`).

With `autoUpdateStrategy: 'background'`, the plugin checks for updates on app start and resume, downloads them in the background, and applies them on the next launch, without any extra code. `readyTimeout` and `autoBlockRolledBackBundles` enable [automatic rollback](https://capawesome.io/docs/cloud/live-updates/rollbacks/): if the app does not report itself as ready within 10 seconds after an update, the plugin reverts to the previous bundle and blocks the broken one.

After configuring the plugin, sync your Capacitor project again:

```bash
npx cap sync
```

### Capawesome Usage

For the rollback to work, call [`ready()`](https://capawesome.io/docs/sdks/capacitor/live-update/#ready) as early as possible at app start, before any other plugin method, to signal that the bundle started successfully:

```js
import { LiveUpdate } from '@capawesome/capacitor-live-update'

await LiveUpdate.ready()
```

Updates are applied on the next app start. To offer the update as soon as it is downloaded, listen for the `nextBundleSet` event and call [`reload()`](https://capawesome.io/docs/sdks/capacitor/live-update/#reload). Note that `reload()` restarts the web view and discards the in-memory state of the app, so ask the user first:

```js
import { LiveUpdate } from '@capawesome/capacitor-live-update'

LiveUpdate.addListener('nextBundleSet', async ({ bundleId }) => {
  if (!bundleId) return
  if (confirm('A new version is available. Install it now?')) {
    await LiveUpdate.reload()
  }
})
```

See [update strategies](https://capawesome.io/docs/cloud/live-updates/update-strategies/) for the alternatives, including checking for updates manually with [`sync()`](https://capawesome.io/docs/sdks/capacitor/live-update/#sync).

### Capawesome Publishing updates

A Live Update bundle is the build output of your web app. In Quasar, this is the `src-capacitor/www` folder. Create it by running the following command from the root of your project:

```bash
quasar build -m capacitor -T [android|ios] --skip-pkg
```

Then log in to Capawesome Cloud with the [Capawesome CLI](https://capawesome.io/docs/cloud/cli/) and follow the prompts:

```bash
npx @capawesome/cli login
```

Once you are logged in, upload the bundle:

```bash
npx @capawesome/cli apps:liveupdates:upload --path src-capacitor/www
```

The CLI asks which app to upload to and publishes the bundle to the app's default [channel](https://capawesome.io/docs/cloud/live-updates/channels/). Congratulations! You have successfully published your first live update.

To test it, install a release build of your app on a device, make a visible change to your web app, rebuild, and upload a new bundle with the same command. Force-close and restart the app, wait about 15 to 30 seconds for the download, then restart it again to see the change. Do not test with `quasar dev -m capacitor`, since live reload loads the web app from the dev server instead of the installed bundle.

> [!IMPORTANT]
> A Live Update can only change the web layer and must stay compatible with the native binary installed on the device. A bundle that relies on a plugin or native change the installed app does not have will crash the app on launch. Once you ship more than one native version, publish each bundle to a channel that matches the native version, as described in [Make Updates Version-Compatible](https://capawesome.io/docs/cloud/live-updates/setup/#make-updates-version-compatible).

### Capawesome Signing bundles

Code signing lets the app verify that every bundle was produced by you and was not modified in transit, so it refuses anything else. Generate an RSA key pair with the CLI:

```bash
npx @capawesome/cli apps:liveupdates:generatesigningkey
```

This creates `private.pem` and `public.pem`. Keep the private key out of version control and add the public key, printed by the command without line breaks, to the plugin configuration:

```ts /src-capacitor/capacitor.config.ts
export default defineCapacitorConfig({
  plugins: {
    LiveUpdate: {
      // ...
      publicKey: '-----BEGIN PUBLIC KEY-----MIGf...IDAQAB-----END PUBLIC KEY-----'
    }
  }
})
```

From then on, sign every upload with the private key:

```bash
npx @capawesome/cli apps:liveupdates:upload --path src-capacitor/www --private-key private.pem
```

See [Sign Your Bundles](https://capawesome.io/docs/cloud/live-updates/code-signing/) for details.

### Capawesome Channels and rollouts

Pass `--channel` to publish to a specific [channel](https://capawesome.io/docs/cloud/live-updates/channels/), for example a `staging` channel for testers, and `--rollout-percentage` to release to a share of devices first and raise it later from the Console:

```bash
npx @capawesome/cli apps:liveupdates:upload --path src-capacitor/www --channel production --rollout-percentage 10
```

To publish from a CI pipeline, create an [API token](https://capawesome.io/docs/cloud/accounts/tokens/), expose it as the `CAPAWESOME_TOKEN` environment variable, and pass `--app-id` so the command runs without prompts.

Feel free to check out the [documentation](https://capawesome.io/docs/sdks/capacitor/live-update/) of the Live Update plugin to see what else you can do with it.
