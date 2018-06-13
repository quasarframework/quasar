import '../src/ie-compat/ie'
import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router'

// "Everything" bit is just a hack.
// Don't use it in your apps.
import Quasar, * as Everything from 'quasar'

import 'quasar-css'
// import iconSet from '../icons/fontawesome'

Vue.use(Quasar, {
  components: Everything,
  directives: Everything,
  plugins: Everything,
  // iconSet,
  config: {}
})

// export a factory function for creating fresh app, router and store
// instances
export function createApp (ssrContext) {
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

  const app = {
    router,
    ...App
  }

  if (ssrContext) {
    Quasar.ssrUpdate({
      app,
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
    })
  }

  return {
    app: new Vue(app),
    router
  }
}
