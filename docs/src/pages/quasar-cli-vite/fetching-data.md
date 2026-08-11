---
title: Fetching Data
desc: (@quasar/app-vite) Fetching data in a Quasar app with the Fetch API, ofetch, axios or any other HTTP client.
related:
  - /quasar-cli-vite/prefetch-feature
  - /vue-components/ajax-bar
---

Quasar does not ship with an HTTP client and does not require a specific one. The native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is available everywhere a Quasar app runs, regardless of the build mode. You can use it directly or pick any library to get additional features, such as interceptors, caching, or reactive state management.

## Picking a library

- [ofetch](https://github.com/unjs/ofetch) - a thin fetch wrapper with automatic JSON parsing and interceptors
- [axios](https://github.com/axios/axios) - a widely used client with interceptors and a large ecosystem (plugins, OpenAPI codegen support, etc.)
- [VueUse useFetch](https://vueuse.org/core/useFetch) - a reactive fetch composable
- [Pinia Colada](https://github.com/posva/pinia-colada) and [TanStack Query](https://github.com/TanStack/query) - caching and async state management on top of any of the above

## A shared API client

Most apps talk to one backend. You can configure a client once with the base URL and common settings, then reuse it across the app. A [boot file](/quasar-cli-vite/boot-files) is a good place for this.

The example below uses ofetch, but the pattern is the same for any client, such as `axios.create()` or your own fetch wrapper. First, install the package:

```tabs
<<| bash PNPM |>>
pnpm add ofetch
<<| bash Yarn |>>
yarn add ofetch
<<| bash NPM |>>
npm install ofetch
<<| bash Bun |>>
bun add ofetch
```

Then create the boot file and register it in the `boot` array of your `quasar.config` file:

```js /src/boot/api.js
import { defineBoot } from '#q-app'
import { ofetch } from 'ofetch'

// Not suitable for SSR if you add per-user state to it. See the SSR considerations section below.
export const apiFetch = ofetch.create({
  baseURL: 'https://api.example.com'
  // you can add interceptors (onRequest, onResponse, ...) and other options here
})

export default defineBoot(({ app }) => {
  // You can use the app instance here if needed
})
```

Usage in a component:

```html
<script setup>
  import { ref } from 'vue'
  import { Notify } from 'quasar'
  import { apiFetch } from '@/boot/api'

  const data = ref(null)

  async function loadData() {
    try {
      data.value = await apiFetch('/backend/data')
    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: 'Loading failed'
      })
    }
  }
</script>
```

ofetch returns the parsed body directly and throws on error responses, so there is no `response.data` step.

## SSR considerations

In a SPA, each visitor runs their own copy of the app in their browser, so the module-level `apiFetch` instance above belongs to that visitor alone. SSR is different. One Node process renders pages for all visitors, module-level code runs once at server startup, and the resulting `apiFetch` instance is shared across all incoming requests.

A shared instance is fine as long as it only holds data that is the same for everyone, like the base URL. It becomes a problem when per-user data ends up in module scope:

```js
let token = null

export const apiFetch = ofetch.create({
  baseURL: 'https://api.example.com',
  onRequest({ options }) {
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  }
})

// called after a user logs in
export function setToken(newToken) {
  token = newToken
}
```

In the browser, this works fine. On the server, that `token` variable is shared by every visitor. If user A logs in while the server is rendering a page for user B, user B's requests now carry user A's token.

You could avoid storing anything by passing the token with every single call, but that is repetitive and error-prone. The robust solution is to create the client inside the boot function. On the server, boot files run once per incoming request, so such a client belongs to a single request and can safely hold per-user state:

```tabs
<<| ts /src/boot/api.ts |>>
import { defineBoot } from '#q-app'
import { ofetch, type $Fetch } from 'ofetch'
import { inject, type InjectionKey } from 'vue'

const injectionKey = Symbol('apiFetch') as InjectionKey<$Fetch>

// Helper function to access the client anywhere else
export function useApi() {
  const apiFetch = inject(injectionKey)
  if (!apiFetch) {
    throw new Error('API client not provided')
  }

  return apiFetch
}

export default defineBoot(({ app, ssrContext }) => {
  const apiFetch = ofetch.create({
    baseURL: 'https://api.example.com',
    // forward the visitor's cookies to the API
    headers: ssrContext ? { cookie: ssrContext.req.headers.cookie ?? '' } : {}
  })

  app.provide(injectionKey, apiFetch)
})
<<| js /src/boot/api.js |>>
import { defineBoot } from '#q-app'
import { ofetch } from 'ofetch'
import { inject } from 'vue'

const injectionKey = Symbol('apiFetch')

// Helper function to access the client anywhere else
export function useApi() {
  const apiFetch = inject(injectionKey)
  if (!apiFetch) {
    throw new Error('API client not provided')
  }

  return apiFetch
}

export default defineBoot(({ app, ssrContext }) => {
  const apiFetch = ofetch.create({
    baseURL: 'https://api.example.com',
    // forward the visitor's cookies to the API
    headers: ssrContext ? { cookie: ssrContext.req.headers.cookie ?? '' } : {}
  })

  app.provide(injectionKey, apiFetch)
})
```

Then, in a component:

```html
<script setup>
  import { useApi } from '@/boot/api'

  const apiFetch = useApi()

  async function loadData() {
    const data = await apiFetch('/private/data')
    // ...
  }
</script>
```

or in another boot file:

```js
import { defineBoot } from '#q-app'
import { useApi } from '@/boot/api'

export default defineBoot(async ({ app }) => {
  // `inject()` needs an active Vue context, but boot files run outside of it, so we use `runWithContext`
  const apiFetch = app.runWithContext(() => useApi())

  const data = await apiFetch('/private/data')
  // ...
})
```

The trade-off: a per-request instance cannot be created and exported at module level, so you access it through the `useApi()` helper instead of a plain import.

As for the token itself: if authentication must survive a page reload, prefer a server-managed cookie with `HttpOnly`, `Secure` and `SameSite` over storing tokens where page JavaScript can read them.

## Related features

The [Prefetch feature](/quasar-cli-vite/prefetch-feature) can fetch data before the route component is displayed.

To show feedback while a request is running, use [QAjaxBar](/vue-components/ajax-bar) or the [LoadingBar plugin](/quasar-plugins/loading-bar).
