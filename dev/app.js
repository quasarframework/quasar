import '../src/ie-compat/ie'
import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router'

// "Everything" bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import 'quasar-css'
import './app.styl'
// import iconSet from '../icons/fontawesome'

Vue.use(Quasar, {
  components: Everything,
  directives: Everything,
  plugins: Everything,
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
    ...App
  }

  const ctx = { app }

  if (ssrContext) {
    ctx.ssr = {
      req: ssrContext.req,
      res: ssrContext.res,
      setBodyClasses (cls) {
        ssrContext.bodyClasses = cls.join(' ')
      },
      setHtmlAttrs (attrs) {
        const str = []
        for (let key in attrs) {
          str.push(`${key}=${attrs[key]}`)
        }
        ssrContext.htmlAttrs = str.join(' ')
      }
    }
  }

  Quasar.ssrUpdate(ctx)

  return {
    app: new Vue(app),
    router
  }
}
