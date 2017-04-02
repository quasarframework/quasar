import Vue from 'vue'
import Quasar, { AddressbarColor, Components, Directives } from 'quasar'
import router from './router'

require('../src/themes/quasar.' + __THEME + '.styl')
Vue.use(Quasar, {
  components: Components,
  directives: Directives
})
AddressbarColor.set()

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App'))
  })
})
