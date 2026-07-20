---
title: SEO for SSR
description: (@quasar/app-vite) Managing the search engine optimizations in a Quasar server-side rendered app.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssr/seo-for-ssr
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Server-rendered content helps crawlers read each route, but effective search optimization still requires accurate per-page metadata. Use the [Quasar Meta Plugin](/quasar-plugins/meta) to provide it during SSR.

## Quasar Meta Plugin

The [Quasar Meta Plugin](/quasar-plugins/meta) can dynamically change page title, manage `<meta>` tags, manage `<html>` and `<body>` DOM element attributes, add/remove/change `<style>` and `<script>` tags in the head of your document (useful for CDN stylesheets or for json-ld markup, for example), or manage `<noscript>` tags.

::: tip
The Meta Plugin integrates with Quasar SSR so metadata collected while rendering is included in the server response and then managed on the client after hydration.
:::
