---
title: Installing PWA-specific dependencies
description: (@quasar/app-vite) How to handle PWA-specific dependencies.
canonical: https://quasar.dev/quasar-cli-vite/developing-pwa/installing-pwa-dependencies
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Notice the `/src-pwa/package.json` file in your generated `/src-pwa` folder. The purpose of it is for you to be able to install packages used by the PWA mode directly under this folder (and not pollute the common `/src`).

```json /src-pwa/package.json
{
  "name": "quasar-pwa-app",
  "version": "1.0.0",
  "description": "Quasar PWA Folder",
  "private": true,
  "type": "module",
  "dependencies": {
    "register-service-worker": "^1.7.2"
  },
  "devDependencies": {
    "workbox-build": "^7.0.0",
    "workbox-cacheable-response": "^7.0.0",
    "workbox-core": "^7.0.0",
    "workbox-expiration": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0"
  }
}
```

Installing PWA specific packages:

```tabs
<<| bash PNPM |>>
# run in /src-pwa for deps used by /src-pwa/register-sw file:
pnpm add <deps>

# run in /src-pwa for deps used by the build system (eg. workbox-* suite)
pnpm add -D <dev-deps>
<<| bash Yarn |>>
# run in /src-pwa for deps used by /src-pwa/register-sw file:
yarn add <deps>

# run in /src-pwa for deps used by the build system (eg. workbox-* suite)
yarn add -D <dev-deps>
<<| bash NPM |>>
# run in /src-pwa for deps used by /src-pwa/register-sw file:
npm install <deps>

# run in /src-pwa for deps used by the build system (eg. workbox-* suite)
npm install -D <dev-deps>
<<| bash Bun |>>
# run in /src-pwa for deps used by /src-pwa/register-sw file:
bun add <deps>

# run in /src-pwa for deps used by the build system (eg. workbox-* suite)
bun add -D <dev-deps>
```
