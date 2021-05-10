---
title: Managing Google Analytics
desc: How to use analytics in a Quasar hybrid mobile app with Cordova.
---
Getting to know your users and measuring user behavior is an important step in App Development. Unfortunately, it takes a bit of non-standard work to get Google Analytics to work after wrapping your mobile app with Cordova. Setting up Google Analytics in a pure web application is quite easy, but Cordova somehow prevents pageviews and events from being sent to Google Analytics.

Follow this guide to implement Google Analytics into your Cordova powered Quasar App.

You may also want to read these great tutorials:
- [Google Tag Manager and Analytics Setup for an SPA Website](https://jannerantala.com/tutorials/quasar-framework-google-tag-manager-and-analytics-setup-for-an-spa-website/)
- [Google Analytics Setup for a Cordova App](https://jannerantala.com/tutorials/quasar-framework-google-analytics-setup-for-cordova-app/)

::: warning
You'll need to include a `<script>` tag provided by Google in `/src/index.template.html`, which will make your App depend on an Internet connection!
:::

## Prerequisites
* Make sure all your routes have a name and path parameter specified. Otherwise, they cannot be posted to the `ga.logPage` function. Please refer to [Routing](/quasar-cli/routing) for more info on routing.
* Have Basic knowledge of Google Analytics

## Preparation
Before we can start implementing Google Analytics into your application, you'll need an account for [Google Analytics](https://analytics.google.com) and [Google Tagmanager](https://tagmanager.google.com/). So let's do that first. When you have these accounts, it's time to configure Tag manager. Follow the steps in this [Multiminds article](https://www.multiminds.eu/blog/2016/12/google-analytics-and-tag-manager-with-ionic-and-cordova-apps/) to do so.

## Implementing this into application
> For this guide, we'll assume you have a fixed sessionId that you send to Google Analytics. Google Analytics uses a sessionId to distinguish different users from each other. If you want to create an anonymous sessionId, see [Analytics Documentation on user id](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id).

Place the Tag Manager snippet into head of your `index.html` file (if you've followed the [Multiminds article](http://www.multiminds.eu/2016/12/06/google-analytics-tag-manager-ionic-cordova/), you already have this.) Create a new file in your codebase called `analytics.js` with the following contents:

```javascript
export default {
  logEvent(category, action, label, sessionId = null) {
    window.dataLayer.push({
      appEventCategory: category,
      appEventAction: action,
      appEventLabel: label,
      sessionId: sessionId
    })
    window.dataLayer.push({ 'event': 'appEvent' })
  },

  logPage(path, name, sessionId = null) {
    window.dataLayer.push({
      screenPath: path,
      screenName: name,
      sessionId: sessionId
    })
    window.dataLayer.push({ 'event': 'appScreenView' })
  }
}
```
To make sure all the pages in your application are automatically posted to Google Analytics, we create an app boot file:
```bash
$ quasar new boot google-analytics [--format ts]
```
Then we edit the newly created file: `/src/boot/google-analytics.js`:
```
import ga from 'analytics.js'

export default ({ router }) => {
  router.afterEach((to, from) => {
    ga.logPage(to.path, to.name, sessionId)
  })
}
```
Finally we register the app boot file in `/quasar.conf.js`. We can do so only for Cordova wrapped apps if we want:
```
boot: [
  ctx.mode.cordova ? 'google-analytics' : ''
]
```

More information about events can be found in the [Analytics documentation on events](https://developers.google.com/analytics/devguides/collection/analyticsjs/events).

You'll see the events and pageviews coming in when you run your app. It usually takes around 5 to 10 seconds for a pageview to be registered in the realtime view.
