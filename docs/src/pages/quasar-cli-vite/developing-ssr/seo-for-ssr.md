---
title: SEO for SSR
desc: (@quasar/app-vite) Managing the search engine optimizations in a Quasar server-side rendered app.
---

Server-rendered content helps crawlers read each route, but effective search optimization still requires accurate per-page metadata. Use the [Quasar Meta Plugin](/quasar-plugins/meta) to provide it during SSR.

## Quasar Meta Plugin

The [Quasar Meta Plugin](/quasar-plugins/meta) can dynamically change page title, manage `<meta>` tags, manage `<html>` and `<body>` DOM element attributes, add/remove/change `<style>` and `<script>` tags in the head of your document (useful for CDN stylesheets or for json-ld markup, for example), or manage `<noscript>` tags.

::: tip
The Meta Plugin integrates with Quasar SSR so metadata collected while rendering is included in the server response and then managed on the client after hydration.
:::
