---
title: SSG Code Caveats
desc: (@quasar/app-vite) SSG code caveats with Quasar CLI.
related:
  - /vue-composables/use-hydration
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

When developing a SSG app, you will need to be very familiar with [SSR Mode](/quasar-cli-vite/developing-ssr/introduction), because a SSG app is essentially a build-time rendered SSR app. Therefore, writing code for SSG is the same as for SSR. All SSR concepts apply for it too, like [writing universal code](/quasar-cli-vite/developing-ssr/writing-universal-code), [handling the ssrContext](/quasar-cli-vite/developing-ssr/ssr-context), [client-side hydration](/quasar-cli-vite/developing-ssr/client-side-hydration), and so on.

Both Static Site Generator (SSG) and [Server-Side Rendering (SSR)](/quasar-cli-vite/developing-ssr/introduction) solve the same fundamental problems of traditional SPAs: they both provide excellent SEO and drastically improve the time-to-content. However, they take fundamentally different approaches to when the HTML is actually rendered.

The core difference lies in the rendering timing: SSG renders at build time, while SSR renders at request time. Therefore, when writing your app, you will need to do it in such a way that your content will NOT rely on client specific ssrContext, otherwise you will end up with [client-side hydration errors](/quasar-cli-vite/developing-ssr/client-side-hydration).

## Things to avoid

Avoid using the following features **before client-side gets hydrated**:

- $q.screen ([Screen Plugin](/options/screen-plugin)). Use Quasar [Window-Width related CSS classes](/style/visibility#window-width-related) instead.
- $q.platform ([Platform Plugin](/options/platform-detection)). Unless you use the [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) to generate a SSG page for each $q.platform prop combination that you use (and fill ssrContext with a specific req.headers['User-Agent']).
- $q.cookies ([Cookies Plugin](/quasar-plugins/cookies)). Unless you use the [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) to generate a SSG page for each Cookie that you expect (and fill ssrContext with a specific req.headers.cookies).
- $q.dark ([Dark Plugin](/quasar-plugins/dark)). Unless you use the [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) to generates one "light" and one "dark" SSG page for each route (probably use a cookie with ssrContext.req.headers.cookies to handle it).
- $q.localStorage ([LocalStorage Plugin](/quasar-plugins/web-storage#localstorage-api))
- $q.sessionStorage ([SessionStorage Plugin](/quasar-plugins/web-storage#sessionstorage-api))

However, you can use all the above should you combine it with Quasar's [useHydration](/vue-composables/use-hydration) Vue Composable:

```html Some .vue file
<template>
  <div>
    <template v-if="isHydrated">
      <div v-if="$q.screen.md">...</div>
      <div v-else-if="$q.platform.ios">...</div>
    </template>
  </div>
</template>

<script setup>
  import { watch } from 'vue'
  import { useHydration } from 'quasar'

  const { isHydrated } = useHydration()

  watch(isHydrated, value => {
    if (value) {
      // we now have access and can use $q.screen
      // and $q.platform for example
    }
  })
</script>
```

## Study Case: light and dark mode pages

Let's take an example on how to handle light vs dark mode by leveraging the [Dark Plugin](/quasar-plugins/dark) and [Cookies Plugin](/quasar-plugins/cookies). We need to be careful not to generate hydration errors. So:

- We will be using a cookie named `theme` which can be `light` or `dark`.
- We will generate two SSG pages for each Vue Router route, one for each theme.
- Finally, we will be using Nginx on our deployment server and configure it appropriately to serve the right SSG html file, based on client `theme` cookie.

First, we make sure Cookies and Dark plugins are installed and we disable the default SSG 404 error page (because we'll have two 404 pages, one for each theme):

```js /quasar.config file
{
  framework: {
    plugins: ['Cookies', 'Dark']
  },

  ssg: {
    error404HtmlFilename: false
  }
}
```

Then we edit `/src/App.vue` where we will initialize the Dark plugin with the appropriate theme:

```js /src/App.vue
import { useSSRContext } from 'vue'
import { Cookies, useQuasar } from 'quasar'

const $q = useQuasar()

if (import.meta.env.QUASAR_SERVER) {
  const ssrContext = useSSRContext()
  const cookies = Cookies.parseSSR(ssrContext)
  const theme = cookies.get('theme')

  $q.dark.set(theme === 'dark')
} else {
  const theme = Cookies.get('theme')
  $q.dark.set(theme === 'dark')
}
```

We are now ready to edit our `/src-ssg/ssg-renderer` file:

```js /src-ssg/ssg-renderer file
import { defineSsgGetPages } from '#q-app'
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(
  ({ parseVueRouterRoutes /*, ctx */ }) => {
    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    const initialPages = parseVueRouterRoutes({ routes, verbose: true })
    const ssgPages = []

    // We generate 2 SSG pages, one for each theme
    for (const theme of ['light', 'dark']) {
      // We add an entry for our themed 404 page too:
      ssgPages.push({
        route: '/some-bogus-route',
        label: `404 ${theme}`,
        dir: '', // in root folder
        filename: `404-${theme}.html`,
        ssrContext: {
          req: {
            headers: {
              cookie: `theme=${theme}`
            }
          }
        }
      })

      // For each of our Vue Router routes, we define a themed page:
      initialPages.forEach(page => {
        // We clone the initial definition
        const def = structuredClone(page)
        // Nice to have: we set a label to get a nice log message on errors:
        def.label = theme
        // We define a custom filename:
        def.filename = `index-${theme}.html`
        // We tamper with the ssrContext to set the "theme" cookie when rendering:
        def.ssrContext = {
          req: {
            headers: {
              cookie: `theme=${theme}`
            }
          }
        }
        // Finally, we add it to our accummulator that we will return:
        ssgPages.push(def)
      })
    }

    return ssgPages
  }
)
```

On our deployment server, we configure our nginx. We look for the `theme` cookie. We use it to serve the appropriate html file, while making sure that if the cookie is not set, we serve the default theme (in our specific case here, the "light" themed one).

```nginx nginx config
server {
  // ...

  location / {
    // ...

    set $theme "light";
    if ($cookie_theme = "dark") {
      set $theme "dark";
    }

    error_page 404 /404-$theme.html;
    try_files $uri $uri/ =404;
    index index-$theme.html;
  }
}
```
