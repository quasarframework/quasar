import Vue from 'vue'

// "Everything" bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import App from './App'
import router, { appContext } from './router'

if (__THEME__ === 'mat') {
  require('quasar-extras/roboto-font/roboto-font.css')
}
import 'quasar-extras/material-icons/material-icons.css'
import 'quasar-extras/ionicons/ionicons.css'
import 'quasar-extras/fontawesome/fontawesome.css'
import 'quasar-extras/animate'

Vue.use(Quasar, {
  components: Everything,
  directives: Everything
})

const app = new Vue({
  router,
  render: h => h(App)
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
  app,
  appContext
}
