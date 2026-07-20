---
title: What is SSG
description: (@quasar/app-vite) Introduction on Static Site Generator (SSG) apps with Quasar CLI.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssg/introduction
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

::: warning
Running SSG mode requires Quasar UI v2.22+.
:::

Quasar and Vue.js are frameworks for building client-side applications. By default, Vue components produce and manipulate DOM in the browser as output. However, it is also possible to pre-render the exact same components into HTML strings at build time, send those static pages directly to the browser, and finally "hydrate" the static markup into a fully interactive app on the client.

A statically generated Quasar app uses the same Vue architecture as other Quasar modes, but renders selected routes to HTML files at build time. When a browser loads one of those files, Vue hydrates the existing markup and the app becomes interactive.

## Why SSG?

Compared to a traditional SPA (Single-Page Application) or an SSR (Server-Side Rendered) application, the advantages of SSG primarily lie in:

- Better initial HTML and SEO. Search engines and link preview crawlers receive the rendered page instead of an empty application shell.
- Fast time-to-content. A CDN or static server can return pre-rendered HTML without waiting for a server to render it for each request.
- Simpler hosting. Production does not require a Node.js rendering server. You can deploy the generated files to a static host such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or Amazon S3.
- A smaller production attack surface. There is no application server involved in rendering each page. Any APIs used by the client remain separate and must still be secured normally.

There are also some trade-offs to consider when using SSG:

- Universal-code constraints. As with SSR, code executed during rendering cannot assume that browser globals such as `window` or `document` exist.
- Build time. Every generated page must be rendered during each production build. Large or data-heavy sites can therefore take longer to build.
- Stale content. Build-time HTML does not change until the next deployment. Frequently changing or user-specific data must be refreshed by rebuilding, fetched on the client, or handled through [hybrid SSG + partial CSR](/quasar-cli-vite/developing-ssg/hybrid-ssg-with-partial-csr).

SSG is a good fit for documentation, marketing pages, blogs, catalogs, and other content that can be known at build time. A SPA or SSR app may be a better fit when most pages depend on the current user or on data that must be fresh for every request.

## SSG Caveats

Please read the [SSG Code Caveats](/quasar-cli-vite/developing-ssg/ssg-code-caveats) page to learn how to properly write your SSG code and avoid [client-side hydration errors](/quasar-cli-vite/developing-ssr/client-side-hydration).
