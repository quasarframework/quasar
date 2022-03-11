---
title: What is a PWA
desc: Introduction on what a Progressive Web App is and how it can be configured in a Quasar app.
---
A Progressive Web App (PWA) is a web app that uses modern web capabilities to deliver an app-like experience to users. These apps meet certain requirements (see below), are deployed to web servers and accessible through URLs (on HTTPS protocol).

This can work in conjunction with Cordova to provide a multiple deploy targets for all your users. Quasar CLI allows you to deploy your app as a PWA as well as a Mobile app and take advantage of both channels.

## What is Required
To be considered a Progressive Web App, your app must be:

* Progressive - Work for every user, regardless of browser choice, because they are built with progressive enhancement as a core tenet.
* Responsive - Fit any form factor, desktop, mobile, tablet, or whatever is next.
* Connectivity independent - Enhanced with service workers to work offline or on low quality networks.
* App-like - Use the app-shell model to provide app-style navigation and interactions.
* Fresh - Always up-to-date thanks to the service worker update process.
* Safe - Served via HTTPS to prevent snooping and ensure content has not been tampered with.
* Discoverable - Are identifiable as “applications” thanks to W3C manifests and service worker registration scope allowing search engines to find them.
* Re-engageable - Make re-engagement easy through features like push notifications.
* Installable - Allow users to “keep” apps they find most useful on their home screen without the hassle of an app store.
* Linkable - Easily share via URL and not require complex installation.

More information available on Addy Osmani's [article about PWA](https://addyosmani.com/blog/getting-started-with-progressive-web-apps/).

## Manifest File
An app manifest file describes the resources your app will need. This includes your app’s displayed name, icons, as well as splash screen. Quasar CLI configures this for you, but you can override any property from within `/quasar.conf.js`. Learn how by visiting the [Configure PWA](/quasar-cli/developing-pwa/configuring-pwa) documentation page.

More information: [Manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest).

## Service Worker
The Service worker provides a programmatic way to cache app resources (files). The programmatic API allows developers to decide how to handle caching and provides a much more flexible experience than other options.

More information: [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).


