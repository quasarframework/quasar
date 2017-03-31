import Vue from 'vue'
import Quasar, { AddressbarColor } from 'quasar'
import router from './router'

require('../src/themes/quasar.' + __THEME + '.styl')
Vue.use(Quasar) // Install Quasar Framework
AddressbarColor.set()

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App'))
  })
})
