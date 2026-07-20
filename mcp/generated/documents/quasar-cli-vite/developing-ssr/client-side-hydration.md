---
title: Client Side Hydration
description: (@quasar/app-vite) What hydration is and its caveats in a Quasar server-side rendered app.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssr/client-side-hydration
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Hydration refers to the client-side process during which Vue takes over the static HTML sent by the server and turns it into dynamic DOM that can react to client-side data changes.

Since the server has already rendered the markup, we obviously do not want to throw that away and re-create all the DOM elements. Instead, we want to "hydrate" the static markup and make it interactive.

::: warning
Vue reports hydration mismatches during development and attempts to recover by adjusting the DOM. Recovery has a performance cost and can produce incorrect behavior, so treat every unexpected mismatch as a bug before deploying.
:::

## Hydration caveats

The server and client must produce the same initial markup. Common causes of mismatches include:

- invalid HTML that the browser repairs before Vue hydrates it
- browser-only values such as viewport dimensions
- time, random values, or locale-dependent formatting that differs between environments
- data that changes between the server render and client hydration
- client-only third-party libraries that access the DOM during setup

For example, browsers insert a `<tbody>` into this invalid table structure:

```html
<table>
  <tr><td>hi</td></tr>
</table>
```

Write the element explicitly so the browser DOM matches Vue's expected structure:

```html
<table>
  <tbody>
    <tr><td>hi</td></tr>
  </tbody>
</table>
```

Use [QNoSsr](/vue-components/no-ssr) when content can only be rendered in the browser. For an unavoidable, intentional difference, Vue also supports the `data-allow-mismatch` attribute; scope it as narrowly as possible rather than hiding unrelated hydration problems.

## Handling hydration errors

When Vue reports a mismatch:

1. Reproduce it with `quasar dev -m ssr` so development diagnostics are enabled.
2. Read the console message and inspect the referenced component and DOM node in Vue Devtools or browser DevTools.
3. Compare the server response in the Network panel with the DOM immediately before hydration.
4. Check the component and its dependencies for browser globals, nondeterministic values, invalid HTML, and request-specific state.
5. Reload the route directly as well as navigating to it from another page. A mismatch that appears only on direct loading usually points to different server and client initialization.
6. Correct the differing initial state or defer the client-only content until after mounting.

Do not rely on production behavior to conceal a mismatch; production builds provide fewer diagnostics.
