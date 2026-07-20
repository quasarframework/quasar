---
title: What is SPA
description: (@quasar/app-vite) Introduction on what a Single Page App is.
canonical: https://quasar.dev/quasar-cli-vite/developing-spa/introduction
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

A Single-Page Application (SPA) is a website that updates the current page dynamically instead of requesting a new HTML document for every navigation. This provides fluid transitions between the application's routes and can make it feel more like a desktop application.

After the initial document loads, the SPA fetches and displays resources as needed, usually in response to navigation or other user actions. Vue Router updates the URL through either its hash or HTML5 history mode, as configured by `build.vueRouterMode` in `/quasar.config`.

A SPA can communicate with APIs in the background without requiring a full-page reload. Direct requests to history-mode URLs still reach the web server first, so production hosting must fall back to `index.html` for application routes.
