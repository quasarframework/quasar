---
title: Managing Google Analytics
desc: (@quasar/app-vite) How to plan analytics integration in a Quasar Cordova app.
---

The former Analytics.js integration is no longer appropriate for new applications. Google Analytics 4 replaced the Universal Analytics APIs that older Cordova examples used, and Google does not maintain an official Cordova analytics plugin.

Choose a maintained Cordova plugin or analytics provider that supports your target platform versions. Follow that provider's native Android and iOS setup, install the plugin from `/src-cordova`, and keep its platform configuration files out of `/src-cordova/www`.

::: warning
- Analytics may require user consent, privacy disclosures, data-safety declarations, and platform-specific configuration. Review the current Google Play, App Store, analytics-provider, and applicable legal requirements before collecting data.
- A remote script executes inside your app's WebView and receives the access available to that renderer. Load scripts only from origins you trust, restrict them with your Content Security Policy, and prefer a maintained native analytics integration when possible. Collect only the data you need, avoid sending secrets or direct identifiers, obtain any consent required by applicable law and store policy, and document collection in the app's privacy disclosures.
:::

## Prerequisites

- Make sure all your routes have a name and path parameter specified. Otherwise, they cannot be posted to the `ga.logPage` function. Please refer to [Page Routing with Vue Router](/quasar-cli-vite/page-routing-with-vue-router) for more info on routing.
- Have Basic knowledge of Google Analytics

## Preparation

Before we can start implementing Google Analytics into your application, you'll need an account for [Google Analytics](https://analytics.google.com) and [Google Tagmanager](https://tagmanager.google.com/). So let's do that first. When you have these accounts, it's time to configure Tag manager. Follow the steps in this [Multiminds article](https://www.multiminds.eu/blog/2016/12/google-analytics-and-tag-manager-with-ionic-and-cordova-apps/) to do so.

## Application integration

> For this guide, we'll assume you have a fixed sessionId that you send to Google Analytics. Google Analytics uses a sessionId to distinguish different users from each other. If you want to create an anonymous sessionId, see [Analytics Documentation on user id](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id).

Wrap the selected plugin behind a small application service rather than calling a plugin global throughout the UI. This gives the app one place to:

- wait for Cordova's `deviceready` event
- disable collection until consent is available
- normalize screen names and event parameters
- handle unsupported browser or development environments
- replace the provider later

To report route changes, create a Quasar boot file with `defineBoot`, then call the service from `router.afterEach`:

```js /src/boot/analytics.js
import { defineBoot } from '#q-app'
import analytics from 'src/services/analytics'

export default defineBoot(({ router }) => {
  router.afterEach(to => {
    analytics.setCurrentScreen(String(to.name ?? to.path))
  })
})
```

Register it only in Cordova mode:

```js /quasar.config file
export default defineConfig(ctx => ({
  boot: [...(ctx.mode.cordova ? ['analytics'] : [])]
}))
```

The exact service implementation depends on the plugin you select. Verify that the plugin is actively maintained, supports GA4 if Google Analytics is required, and documents the necessary consent and native configuration steps.
