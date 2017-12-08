import Vue from 'vue'

// "Everything" bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import App from './App'
import router from './router'

if (__THEME__ === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'

// import iconSet from '../icons/fontawesome'

Vue.use(Quasar, {
  components: Everything,
  directives: Everything,
  plugins: Everything
  // ,iconSet
})

/* eslint-disable no-new */
new Vue({
  el: '#q-app',
  router,
  render: h => h(App)
})
