// DON'T add this imports into your app,
// at least not in this way!
require('../src/ie-compat/ie')
require('../src/css/' + __THEME + '.styl')
// require('../dist/quasar.' + __THEME + '.rtl.css')
require('../src/ie-compat/ie.' + __THEME + '.styl')
// require('../src/ie-compat/ie.' + __THEME + '.rtl.css')

import Vue from 'vue'

// Everything bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import router from './router'

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'

Vue.use(Quasar, {
  components: Everything,
  directives: Everything
})

const app = new Vue({
  router,
  render: h => h(require('./App').default)
})

if (Vue.prototype.$isServer) {
  app.$mount('#q-app')
}
else {
  Quasar.start(() => {
    /* eslint-disable no-new */
    router.onReady(() => {
      app.$mount('#q-app')
    })
  })
}

export default {
  router,
  app
}
