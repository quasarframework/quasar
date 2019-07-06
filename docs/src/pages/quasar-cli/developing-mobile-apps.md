---
title: Developing Mobile Apps
---

Quasar offers two solutions for creating mobile apps: [Apache Cordova](https://cordova.apache.org/), and [Ionic Capacitor](https://capacitor.ionicframework.com).

Cordova is a mobile application development framework originally created by Nitobi. Adobe Systems purchased Nitobi in 2011, rebranded it as PhoneGap, and later released an open source version of the software called Apache Cordova.

Capacitor was created by [Ionic Framework](https://ionicframework.com/) as a more modern replacement for Cordova. It supports most, but not all, Cordova plugins as well as Capacitor-specific plugins.

Both tools enable you to run your website as a native app through a webview. They both expose native device APIs to your JavaScript code, and allow you to write native code in the form of plugins, which can be called through JS. While Cordova supports a wide range of targets, Capacitor only supports iOS and Android. Since Capacitor support in Quasar CLI is not finalized and is considered experimental, we reccomend using Cordova for production apps.

See the docs for [Developing with Capacitor (experimental)](/quasar-cli/developing-capacitor/introduction) or [Developing with Cordova](/quasar-cli/developing-cordova/introduction).