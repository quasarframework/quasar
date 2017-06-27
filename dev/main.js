require('../src/ie-compat/ie')
require('../src/css/' + __THEME + '.styl')
require('../src/ie-compat/ie.' + __THEME + '.styl')

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

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App'))
  })
})
