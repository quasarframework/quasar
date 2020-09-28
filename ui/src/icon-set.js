import { reactive } from 'vue'

import { isSSR } from './plugins/Platform.js'
import materialIcons from '../icon-set/material-icons.js'
import { noop } from './utils/event.js'

export default {
  install ($q, queues, iconSet) {
    const initialSet = iconSet || materialIcons

    this.set = (setObject, ssrContext) => {
      const def = { ...setObject }

      if (isSSR === true) {
        if (ssrContext === void 0) {
          console.error('SSR ERROR: second param required: Quasar.iconSet.set(iconSet, ssrContext)')
          return
        }

        def.set = ssrContext.$q.iconSet.set
        ssrContext.$q.iconSet = def
      }
      else {
        def.set = this.set
        $q.iconSet = def
      }
    }

    if (isSSR === true) {
      queues.server.push((q, ctx) => {
        q.iconSet = {}
        q.iconSet.set = setObject => {
          this.set(setObject, ctx.ssr)
        }

        q.iconSet.set(initialSet)
      })
    }
    else {
      // TODO vue3 - properly reactive
      $q.iconMapFn = reactive(noop)
      $q.iconSet = reactive({})

      this.set(initialSet)
    }
  }
}
