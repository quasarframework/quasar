import '../src/ie-compat/ie'
import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router'

// "Everything" bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import 'quasar-css'

/*
if (process.env.THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/mdi'
import 'quasar-extras/animate'
*/

// import iconSet from '../icons/fontawesome'

// export a factory function for creating fresh app, router and store
// instances
export function createApp (ctx) {
  const config = {}

  if (ctx) {
    config.ssr = {
      req: ctx.req,
      res: ctx.res
    }
  }

  Vue.use(Quasar, {
    components: Everything,
    directives: Everything,
    plugins: Everything,
    config
    // iconSet
  })

  const router = createRouter()

  if (process.env.VUE_ENV === 'client') {
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

  const app = new Vue({
    router,
    ...App
  })

  return { app, router }
}
