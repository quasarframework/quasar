---
title: Managing Google Analytics
desc: (@quasar/app-vite) How to use analytics in a Quasar hybrid mobile app with Capacitor.
---

Google Analytics does not provide an official Capacitor plugin. Choose an analytics integration that supports the platforms and consent requirements of your app. For native Google Analytics, a common approach is to use Firebase Analytics through a community Capacitor plugin.

::: warning

- Analytics may require user consent, privacy disclosures, data-safety declarations, and platform-specific configuration. Review the current Google Play, App Store, analytics-provider, and applicable legal requirements before collecting data.
- A remote script executes inside your app's WebView and receives the access available to that renderer. Load scripts only from origins you trust, restrict them with your Content Security Policy, and prefer a maintained native analytics integration when possible. Collect only the data you need, avoid sending secrets or direct identifiers, obtain any consent required by applicable law and store policy, and document collection in the app's privacy disclosures.

:::

## Prerequisites

- Give every route a `name`, so screen reports carry something more useful than a path. Refer to [Page Routing with Vue Router](/quasar-cli-vite/page-routing-with-vue-router) for more info on routing.
- Have basic knowledge of [Google Analytics](https://analytics.google.com).

## Preparation

Native Google Analytics runs through Firebase, so create a [Firebase](https://console.firebase.google.com/) project and enable Google Analytics on it. This gives you the GA4 property that the app reports into, plus the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files that the plugin's installation guide asks you to add to each native project.

## Install an analytics plugin

The example below uses [`@capacitor-firebase/analytics`](https://capawesome.io/plugins/firebase/analytics/). Follow its installation guide completely, including creating the Firebase projects, adding the Android and iOS configuration files, and configuring each native project.

Install Capacitor-specific dependencies from `/src-capacitor`, then synchronize the native projects:

```bash
cd src-capacitor
pnpm add @capacitor-firebase/analytics firebase
pnpm exec cap sync
```

## Track route changes

Create a boot file that reports route changes after navigation:

```bash
quasar new boot firebase-analytics [--format ts]
```

```js /src/boot/firebase-analytics.js
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'
import { defineBoot } from '#q-app'

export default defineBoot(({ router }) => {
  router.afterEach(to => {
    FirebaseAnalytics.setCurrentScreen({
      screenName: String(to.name ?? to.path)
    }).catch(error => {
      console.error('Unable to record analytics screen', error)
    })
  })
})
```

Register the boot file only for Capacitor mode:

```js /quasar.config file
export default defineConfig(ctx => ({
  boot: [...(ctx.mode.capacitor ? ['firebase-analytics'] : [])]
}))
```

Refer to the plugin documentation for recording events, setting user properties, managing collection, and handling platform-specific behavior. Keep analytics calls behind a small application service if you may change providers later.
