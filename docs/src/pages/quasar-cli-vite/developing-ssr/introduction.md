---
title: What is SSR
desc: Introduction on server-side rendered apps with Quasar CLI.
---

Quasar and Vue.js are frameworks for building client-side applications. By default, Quasar Vue components produce and manipulate DOM in the browser as output. However, it is also possible to render the same components into HTML strings on the server, send them directly to the browser, and finally "hydrate" the static markup into a fully interactive app on the client.

A server-rendered Quasar app can also be considered `isomorphic` or `universal`, in the sense that the majority of your app's code runs on both the server and the client.

## Why SSR?
Compared to a traditional SPA (Single-Page Application), the advantage of SSR primarily lies in:

* **Better SEO**, as the search engine crawlers will directly see the fully rendered page.
* **Faster time-to-content**, especially on slow internet or slow devices. Server-rendered markup doesn't need to wait until all JavaScript has been downloaded and executed to be displayed, so your user will see a fully-rendered page sooner. This generally results in better user experience, and can be critical for applications where time-to-content is directly associated with conversion rate.

There are also some trade-offs to consider when using SSR:

* **Development constraints**. Browser-specific code can only be used inside certain lifecycle hooks; some external libraries may need special treatment to be able to run in a server-rendered app.
* **More server-side load**. Rendering a full app in Node.js is obviously going to be more CPU-intensive than just serving static files, so if you expect high traffic, be prepared for corresponding server load and wisely employ caching strategies.

Before using SSR for your app, the first question you should ask is whether you actually need it. It mostly depends on how important time-to-content is for your app. For example, if you are building an internal dashboard where an extra few hundred milliseconds on initial load doesn't matter that much, SSR would be an overkill. However, in cases where time-to-content is absolutely critical, SSR can help you achieve the best possible initial load performance.

<q-separator class="q-mt-xl" />

> Parts of this page are taken from the official [Vue.js SSR guide](https://ssr.vuejs.org/guide/universal.html#data-reactivity-on-the-server).
