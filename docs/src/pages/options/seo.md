---
title: SEO with Quasar
desc: Managing the search engine optimizations in a Quasar app.
---

The term SEO refers to Search Engine Optimization. And Quasar covers this aspect too through the [Quasar Meta Plugin](/quasar-plugins/meta).

## Quasar Meta Plugin

The [Quasar Meta Plugin](/quasar-plugins/meta) can dynamically change page title, manage `<meta>` tags, manage `<html>` and `<body>` DOM element attributes, add/remove/change `<style>` and `<script>` tags in the head of your document (useful for CDN stylesheets or for json-ld markup, for example), or manage `<noscript>` tags.

Take full advantage of this feature by using it with **Quasar CLI**, especially **for the SSR (Server-Side Rendering) builds**. It doesn't quite makes sense to use it for SPA (Single Page Applications) since the meta information in this case will be added at run-time and not supplied directly by the webserver (as on SSR builds).

::: tip
This Quasar plugin has the most tight integration with Quasar and so it has the best performance against any other similar solution.
:::
