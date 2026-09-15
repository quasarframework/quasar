---
title: Why Quasar?
desc: What Quasar is, what it ships out of the box, and why it cuts development time and cost.
---

Because it gives a Vue.js app everything it needs, whether it ships as a website or goes cross-platform: the same accessible components, plugins and CLI serve a single page app, a server-rendered site, a mobile app, a desktop app or a browser extension, and one codebase can become any of them the day you need it. Every piece, from the components to the build, is documented and ready for the people and the AI agents working on it. Only Quasar can do:

<script doc>
import IntroductionVideo from './IntroductionVideo.vue'
</script>

<IntroductionVideo />

## What is Quasar?

Quasar (pronounced `/ˈkweɪ.zɑɹ/`) is an MIT licensed open-source framework based on Vue.js. It is a UI library of more than 120 components, a set of plugins, directives, composables and utils, and a CLI that builds the same code for every target:

- SPA (Single Page App)
- SSR (Server-side Rendered App), with an optional PWA client takeover
- SSG (Static Site Generator App), with optional PWA client takeover and partial CSR
- PWA (Progressive Web App)
- BEX (Browser Extension)
- Mobile apps (Android, iOS) through Capacitor or Cordova
- Desktop apps (macOS, Windows, Linux) through Electron

Quasar's motto is: **write code once and deploy it everywhere**. One codebase, one set of best practices, and a build that only includes what the target needs: a website build carries nothing of the mobile or desktop code.

## Why Quasar?

#### All platforms, one codebase

One authoritative source of code for responsive websites (SPA, SSR, SSG, each with optional PWA takeover), PWAs, mobile apps that look native and multi-platform desktop apps. The [Quasar CLI](/start/quasar-cli) ties the build modes together, so switching from a website to a mobile app is a command, not a rewrite.

#### Components that are fast and accessible by default

There is a component for almost every need, each crafted for the best experience of your users and for performance: components that are off screen cost nothing, popups position natively where the browser can do it, and animations run off the main thread. Every component ships with WAI-ARIA semantics, keyboard navigation and focus management [built in](/options/accessibility), with no configuration.

#### Ready for AI agents

The documentation and the API of every component, plugin and directive ship inside the `quasar` and `@quasar/app-vite` packages. The [@quasar/mcp server](/start/ai-agents) hands any MCP-capable coding agent the pages and API of the exact versions your project runs, offline, and every page on this site has a Markdown twin for agents that browse the web.

#### On the web platform's Baseline

Quasar targets [Baseline Widely Available](/start/browser-support): features that have worked across Chrome, Edge, Firefox and Safari for at least 30 months, iOS Safari included. Each release train refreshes the build targets, so your app uses the modern platform without carrying yesterday's workarounds.

#### Best practices integrated by default

The CLI scaffolds a project with TypeScript, linting, unit and end-to-end testing harnesses, SSR-safe patterns and PWA tooling available from the first command. Quasar does the heavy lifting, so you are free to focus on your features and not on boilerplate.

#### App Extensions

Quasar App Extensions inject a complete setup, simple or elaborate, into your project with one command. They are also how the community shares what it builds, which makes Quasar one of the most extensible frameworks out there.

#### Full RTL support

Right to left support for both Quasar components and your own code: your CSS is converted to RTL automatically when an RTL language pack is used.

#### Progressively migrate an existing project

The [UMD version](/start/umd) adds Quasar to any page with a CSS and a JS tag, no build step required, and the [Vite plugin](/start/vite-plugin) brings it into an existing Vite app.

#### Language packs and icon sets

74 language packs and 44 icon sets out of the box, from Material Symbols to Font Awesome, MDI, Bootstrap Icons and more. A missing language pack takes five minutes to add.

#### A community that answers

When you hit a problem, the [forum](https://forum.quasar.dev/) and the [Discord chat](https://chat.quasar.dev) are there. Releases come regularly with new features, fixes land fast, and [backers and sponsors](https://donate.quasar.dev) keep the project going.

#### Great documentation

Every component, plugin and build mode comes with live examples, a complete API, and pages kept in step with each release. A lot of care goes into keeping the documentation focused and free of bloat, so that there is no confusion.

## Get started in under a minute

Having said this, let's [get started](/start/quick-start)! You'll be running a website or app in under a minute.
