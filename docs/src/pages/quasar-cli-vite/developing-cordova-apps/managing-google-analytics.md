---
title: Managing Google Analytics
desc: (@quasar/app-vite) How to plan analytics integration in a Quasar Cordova app.
---

The former Analytics.js integration is no longer appropriate for new applications. Google Analytics 4 replaced the Universal Analytics APIs that older Cordova examples used, and Google does not maintain an official Cordova analytics plugin.

Choose a maintained Cordova plugin or analytics provider that supports your target platform versions. Follow that provider's native Android and iOS setup, install the plugin from `/src-cordova`, and keep its platform configuration files out of `/src-cordova/www`.

::: warning
Analytics may require user consent, privacy disclosures, data-safety declarations, and platform-specific configuration. Review the current Google Play, App Store, analytics-provider, and applicable legal requirements before collecting data.
:::

## Application integration

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
