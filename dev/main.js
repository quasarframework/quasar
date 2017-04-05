import Vue from 'vue'
import Quasar, * as Everything from 'quasar'
import router from './router'
import moment from 'moment'

require('../src/themes/quasar.' + __THEME + '.styl')
Vue.use(Quasar, {
  deps: {
    moment
  },
  components: Everything,
  directives: Everything
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App'))
  })
})
