---
title: Ajax Requests
desc: Using Axios for fetching data in a Quasar app.
---

> We recommend selecting Axios during project initialization.

If you haven't selected Axios during the project initialization then you should create a new boot file `axios.js` that looks like this:
(Here you can also specify additional settings for your axios instance)

```js
// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'https://api.example.com' })

export default boot(({ app }) => {
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

Also make sure to yarn/npm install the `axios` package.

::: tip
Be sure to check out [Prefetch Feature](/quasar-cli/prefetch-feature) if you are using Quasar CLI.
:::

Usage in your single file components methods will be like below. Notice that in the next example we're using the Quasar's [Notify plugin](/quasar-plugins/notify) (through `$q = useQuasar()` and `$q.notify`) which you'll need to install (follow the link earlier).

```js
import { api } from 'boot/axios'

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

Usage in Vuex Actions for globally adding headers to axios (such as during authentication):

```js
import { api } from 'boot/axios'

export function register ({ commit }, form) {
  return api.post('/auth/register', form)
    .then(response => {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
      commit('login', {token: response.data.token, user: response.data.user})
    })
}
```

Also look at [Axios docs](https://github.com/axios/axios) for more information.
