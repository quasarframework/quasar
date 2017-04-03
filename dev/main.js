import Vue from 'vue'
import Quasar, { AddressbarColor, Components, Directives } from 'quasar'
import router from './router'
import moment from 'moment'

require('../src/themes/quasar.' + __THEME + '.styl')
Vue.use(Quasar, {
  deps: {
    moment
  },
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
