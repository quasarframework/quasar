---
title: What is SSG
desc: (@quasar/app-vite) Introduction on Static Site Generator (SSG) apps with Quasar CLI.
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Quasar and Vue.js are frameworks for building client-side applications. By default, Vue components produce and manipulate DOM in the browser as output. However, it is also possible to pre-render the exact same components into HTML strings at build time, send those static pages directly to the browser, and finally "hydrate" the static markup into a fully interactive app on the client.

A statically site generated (SSG) Quasar app (often referred to as Jamstack) allows you to write your application using the same Vue architecture you are used to, but outputs flat HTML files for each of your routes.

## Why SSG?

Compared to a traditional SPA (Single-Page Application) or an SSR (Server-Side Rendered) application, the advantages of SSG primarily lie in:

- Better SEO, as search engine crawlers will directly see the fully rendered page.
- Extremely fast time-to-content. Because the HTML is pre-rendered at build time, it doesn't require a server to generate the page on the fly. You can serve these static files directly from a global CDN, meaning your users will see a fully-rendered page almost instantly.
- Cheaper and easier hosting. You do not need to maintain, monitor, or pay for a Node.js server to render your pages. Your entire app can be hosted on any static file hosting service (like Netlify, Vercel, GitHub Pages, or Amazon S3).
- Better security. Since there is no database or server-side execution running to generate the page, there are fewer vulnerabilities and attack vectors.

There are also some trade-offs to consider when using SSG:

- Development constraints. Just like with SSR, browser-specific code (like window or document) can only be used inside certain lifecycle hooks. Some external libraries may need special treatment to run during the build process.
- Build times. Because every route must be generated when you build the application, large sites with thousands of pages can take a significant amount of time to compile.
- Dynamic content. Since pages are rendered at build time, content can become stale. If a page relies on data that changes frequently (like a live feed or user-specific dashboard), SSG might not be the best fit, or it will require fetching that dynamic data on the client-side after the static shell loads.

Before using SSG for your app, the first question you should ask is how often your data changes and how important SEO and initial load times are. If you are building a blog, documentation site, marketing page, or e-commerce storefront, SSG is often the perfect choice. However, if you are building an internal dashboard or a highly dynamic application tailored to individual logged-in users, a standard SPA or SSR approach might be more appropriate.

## SSG Caveats

Please read the [SSG Code Caveats](/quasar-cli-vite/developing-ssg/ssg-code-caveats) page to learn how to properly write your SSG code and avoid [client-side hydration errors](/quasar-cli-vite/developing-ssr/client-side-hydration).
