---
title: Live Updates
desc: (@quasar/app-vite) How to enable live updates for a Quasar hybrid mobile app with Capacitor.
---

Live Updates, also known as Over-the-Air (OTA) or hot code updates, are a way to push updates to your app without going through the app store review process. This is particularly useful for bug fixes or minor updates that don't require a full app release.

## Installation

To enable Live Updates in your Quasar Capacitor app, you need to install the `@capawesome/capacitor-live-update` plugin. First, navigate to your Capacitor project directory:

```bash
cd src-capacitor
```

Then, install the plugin:

```bash
npm install @capawesome/capacitor-live-update
```

After that, you need to sync the changes with your native projects:

```bash
npx cap sync
```

## Configuration

Next, you need to configure the plugin to work with [Capawesome Cloud](https://cloud.capawesome.io/).

### App ID

In order for your app to identify itself to Capawesome Cloud, you need to set the `appId` in your `capacitor.config.ts` file. For this, you need to create an app on the [Capawesome Cloud Console](https://console.cloud.capawesome.io/) and get the App ID.

```json
{
  "plugins": {
    "LiveUpdate": {
      "appId": "00000000-0000-0000-0000-000000000000"
    }
  }
}
```

Replace `00000000-0000-0000-0000-000000000000` with your actual App ID from the Capawesome Cloud Console.

After configuring the App ID, sync your Capacitor project again:

```bash
npx cap sync
```

## Usage

The most basic usage of the Live Update plugin is to call the [`sync(...)`](https://capawesome.io/plugins/live-update/#sync) method when the app starts. This method checks for updates, downloads them if available, and sets them as the next bundle to be applied. You can then call the [`reload()`](https://capawesome.io/plugins/live-update/#reload) method to apply the update immediately. If the [`reload()`](https://capawesome.io/plugins/live-update/#reload) method is not called, the new bundle will be used on the next app start.

```ts
import { LiveUpdate } from "@capawesome/capacitor-live-update";

const sync = async () => {
  const result = await LiveUpdate.sync();
  if (result.nextBundleId) {
    await LiveUpdate.reload();
  }
};
```

## Publishing updates

To publish your first update, you need to [create a bundle](https://capawesome.io/cloud/live-updates/bundles/#create-a-bundle) on Capawesome Cloud. For this, you need a bundle artifact. A bundle artifact is the build output of your web app. In Quasar, this is the `src-capacitor/www` folder. You can create a bundle artifact by running the following command:

```bash
quasar build -m capacitor -T [android|ios]
```

This will create a `src-capacitor/www` folder with the build output of your web app. You can then upload this folder to Capawesome Cloud using the [Capawesome CLI](https://capawesome.io/cloud/cli/).
To install the Capawesome CLI, run the following command:

```bash
npm install -g @capawesome/cli
```

After installing the Capawesome CLI, you need to log in to your Capawesome Cloud account. Run the following command and follow the instructions:

```bash
npx capawesome login
```

Once you are logged in, you can create a bundle by running the following command:

```bash
npx capawesome apps:bundles:create --path src-capacitor/www
```

Congratulations! You have successfully published your first live update. You can now test it by running your app on a device or emulator. The app will check for updates and apply them if available.
Feel free to check out the [documentation](https://capawesome.io/plugins/live-update/) of the Live Update plugin to see what else you can do with it.

