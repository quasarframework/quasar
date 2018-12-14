import '../src/ie-compat/ie'
import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router'

// this imports everything from Quasar
import Quasar from 'quasar'

import 'quasar-css'
import './app.styl'
// import iconSet from '../icons/fontawesome'

import 'quasar-extras/fontawesome/fontawesome.css'
import 'quasar-extras/mdi/mdi.css'
import 'quasar-extras/ionicons/ionicons.css'
// import 'quasar-extras/eva-icons/eva-icons.css'
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'

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
