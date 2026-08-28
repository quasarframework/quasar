---
title: Browser Support
desc: The browsers and Node.js versions that Quasar officially supports, following the web platform's Baseline.
related:
  - /quasar-cli-vite/browser-compatibility
---

Quasar follows the web platform's [Baseline](https://web.dev/baseline) initiative. The `quasar` UI package is built for **Baseline Widely Available**: web features that have been working across all core browsers (Chrome, Edge, Firefox and Safari) for at least 30 months.

## Browsers

Each Quasar UI release train refreshes its build targets to the minimum browser versions of Baseline Widely Available at that point in time. The current targets are:

| Browser                               | Minimum version |
| ------------------------------------- | --------------- |
| Google Chrome (desktop and Android)   | 121             |
| Microsoft Edge                        | 121             |
| Mozilla Firefox (desktop and Android) | 123             |
| Apple Safari (macOS and iOS)          | 17.2            |

Baseline Widely Available is a rolling window, so these minimums slowly advance with new Quasar releases. A browser version at most 30 months old is always supported.

## Your app code

The `quasar` package ships JavaScript and CSS compiled for the browsers above. What happens with your own code depends on how you consume it:

- With [Quasar CLI (with Vite)](/start/quasar-cli), your code and the final bundles are compiled per the `build.target` setting of your `/quasar.config` file, which defaults to Vite's own `'baseline-widely-available'` preset on the browser side and `'node22'` on the Node.js side. See [Browser compatibility](/quasar-cli-vite/browser-compatibility) for tweaking it.
- With the [Vite plugin](/start/vite-plugin), Vite's `build.target` applies (same `'baseline-widely-available'` default).
- With [UMD](/start/umd), the dist files run in the browser as-is, so the minimum versions above apply directly.

## Node.js

On the server side (SSR), the `quasar` package requires **Node.js 22 or newer**. The tooling around it has its own requirements:

| Package            | Node.js                           |
| ------------------ | --------------------------------- |
| `quasar` (SSR)     | 22+                               |
| `@quasar/cli`      | 20.20+                            |
| `@quasar/app-vite` | 22.22+ (even-numbered LTS majors) |

We recommend running the latest LTS release of Node.js.
