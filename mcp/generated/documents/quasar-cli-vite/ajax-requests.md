---
title: Ajax Requests
description: (@quasar/app-vite) Using Axios for fetching data in a Quasar app.
canonical: https://quasar.dev/quasar-cli-vite/ajax-requests
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

> We recommend selecting Axios during project initialization.

If you haven't selected Axios during the project initialization then you should create a new boot file `axios.js` that looks like this:
(Here you can also specify additional settings for your axios instance)

```js /src/boot/axios.js
import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({ baseURL: 'https://api.example.com' })

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
```

Also install the `axios` package with your project's package manager.

::: tip
Be sure to check out [Prefetch Feature](/quasar-cli-vite/prefetch-feature) if you are using Quasar CLI.
:::

Usage in your single file components methods will be like below. Notice that in the next example we're using the Quasar's [Notify plugin](/quasar-plugins/notify) (through `$q = useQuasar()` and `$q.notify`) which you'll need to install (follow the link earlier).

```js
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

setup () {
  const $q = useQuasar()
  const data = ref(null)

  function loadData () {
    api.get('/api/backend')
      .then((response) => {
        data.value = response.data
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
  }

  return { data, loadData }
}
```

Usage in Pinia Actions for globally adding headers to axios (such as during authentication):

```js
import { api } from '@/boot/axios'

export const useAuthStore = defineStore('auth', {
  actions: {
    register(form) {
      return api.post('/auth/register', form).then(response => {
        api.defaults.headers.common['Authorization'] =
          'Bearer ' + response.data.token
        // do something with { token: response.data.token, user: response.data.user }
      })
    }
  }
})
```

This example keeps the token only in memory. Clear the default `Authorization` header when the user signs out. If authentication must survive a reload, choose a storage strategy based on your backend's threat model; do not assume that browser storage protects tokens from JavaScript running in the page. Where appropriate, a server-managed `HttpOnly`, `Secure`, and `SameSite` cookie prevents client-side JavaScript from reading the session token.

Also look at [Axios docs](https://github.com/axios/axios) for more information.
