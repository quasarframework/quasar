import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import App from './App'

import moment from 'moment'
moment.locale('de')

Quasar.theme.set(__THEME)
Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#quasar-app',
    router,
    render: h => h(App)
  })
})
