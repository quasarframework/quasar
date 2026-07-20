---
title: SSR with TypeScript
description: (@quasar/app-vite) How to use TypeScript with SSR in Quasar
canonical: https://quasar.dev/quasar-cli-vite/developing-ssr/ssr-with-typescript
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

When SSR mode is added to a TypeScript project, Quasar scaffolds TypeScript files in `/src-ssr`. If the project was converted to TypeScript after SSR mode was added, rename the `.js` files in `/src-ssr` to `.ts` and apply the required type annotations.

Check the [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) and [SSR Middleware](/quasar-cli-vite/developing-ssr/ssr-middleware) pages for examples with TypeScript.

Depending on the webserver of your choice, you may also need to additionally [install @types/\* packages](/quasar-cli-vite/developing-ssr/installing-ssr-dependencies) into your /src-ssr folder.
