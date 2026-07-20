---
title: Managing Google Analytics
description: (@quasar/app-vite) How to use analytics in a Quasar hybrid mobile app with Capacitor.
canonical: https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/managing-google-analytics
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Google Analytics does not provide an official Capacitor plugin. Choose an analytics integration that supports the platforms and consent requirements of your app. For native Google Analytics, a common approach is to use Firebase Analytics through a community Capacitor plugin.

::: warning

- Analytics may require user consent, privacy disclosures, data-safety declarations, and platform-specific configuration. Review the current Google Play, App Store, analytics-provider, and applicable legal requirements before collecting data.
- A remote script executes inside your app's WebView and receives the access available to that renderer. Load scripts only from origins you trust, restrict them with your Content Security Policy, and prefer a maintained native analytics integration when possible. Collect only the data you need, avoid sending secrets or direct identifiers, obtain any consent required by applicable law and store policy, and document collection in the app's privacy disclosures.

:::

## Prerequisites

- Make sure all your routes have a name and path parameter specified. Otherwise, they cannot be posted to the `ga.logPage` function. Please refer to [Page Routing with Vue Router](/quasar-cli-vite/page-routing-with-vue-router) for more info on routing.
- Have Basic knowledge of Google Analytics

## Preparation

Before we can start implementing Google Analytics into your application, you'll need an account for [Google Analytics](https://analytics.google.com) and [Google Tagmanager](https://tagmanager.google.com/). So let's do that first. When you have these accounts, it's time to configure Tag manager. Follow the steps in this [Multiminds article](https://www.multiminds.eu/blog/2016/12/google-analytics-and-tag-manager-with-ionic-and-cordova-apps/) to do so.

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
