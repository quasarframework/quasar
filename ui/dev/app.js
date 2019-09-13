import '../src/ie-compat/ie'
import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router'

// this imports everything from Quasar
import Quasar from 'quasar'

/************************************************
 * Enable either Sass or Stylus -- but NEVER BOTH
 ************************************************/
// import '../src/css/index.sass'
// import '../src/css/flex-addon.sass'

import '../src/css/index.styl'
// import '../src/css/flex-addon.styl'
/************************************************/

import './app.styl'
// import iconSet from '../icon-set/fontawesomeV5'

import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/mdi-v4/mdi-v4.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/themify/themify.css'
import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'

Vue.use(Quasar, {
  // iconSet,
  config: {}
})

const testHydration = true

// export a factory function for creating fresh app, router and store
// instances
export function createApp (ssrContext) {
  const router = createRouter()

  // we get each page from server first!
  if (testHydration && process.env.CLIENT) {
    console.log('[Quasar] !!!!')
    console.log('[Quasar] On route change we deliberately load page from server -- in order to test hydration errors')
    console.log('[Quasar] !!!!')

    let reload = false
    router.beforeEach((to, from, next) => {
      if (reload) {
        window.location.href = to.fullPath
        return
      }
      reload = true
      next()
    })
  }

  const app = {
    router,
    render: h => h(App)
  }

  Quasar.ssrUpdate({ app, ssr: ssrContext })

  return {
    app: new Vue(app),
    router
  }
}
