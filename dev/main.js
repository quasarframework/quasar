import Vue from 'vue'
import Quasar from 'quasar'
import moment from 'moment'

import router from './router'
import App from './App'

Quasar.theme.set(__THEME)
Vue.use(Quasar) // Install Quasar Framework

moment.locale('de')

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#quasar-app',
    router,
    render: h => h(App)
  })
})
