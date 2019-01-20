---
title: Ajax Requests
---

> Quasar recommends Axios during project initialization: `Use Axios for Ajax calls? (Y/n)`

Then you should create a new boot file `axios.js` that looks like this:
(Here you can also specify additional settings for your axios instance)
```
import axios from 'axios'

export default ({app, router, Vue}) => {
  Vue.prototype.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios
  //       so you won't necessarily have to import axios in each vue file
}
```

Usage in your single file components methods will be like:
```
methods: {
  loadData () {
    this.$axios.get('/api/backend')
      .then((response) => {
        this.data = response.data
      })
      .catch(() => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
  },
```

Usage in Vuex Actions for globally adding headers to axios (such as during authentication):
```
import axios from 'axios'

export function register ({commit}, form) {
  return axios.post('api/auth/register', form)
    .then(response => {
      commit('login', {token: response.data.token, user: response.data.user})
      setAxiosHeaders(response.data.token)
    })
}

function setAxiosHeaders (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}
```

Also look at [Axios docs](https://github.com/axios/axios) for more information.