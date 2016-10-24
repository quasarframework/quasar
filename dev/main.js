import Vue from 'vue'
import Quasar from 'quasar'

import Router from './router'
import App from './App'

require('../src/themes/quasar.' + __THEME + '.styl')

Quasar.theme.set(__THEME)
Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#quasar-app',
    router: Router,
    render: h => h(App)
  })
})
