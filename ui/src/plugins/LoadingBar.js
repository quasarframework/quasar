import { h, ref } from 'vue'

import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { noop } from '../utils/event.js'
import { createGlobalNode } from '../utils/private/global-nodes.js'
import { createChildApp } from '../install-quasar.js'

import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

const barRef = ref(null)

const Plugin = defineReactivePlugin({
  isActive: false
}, {
  start: noop,
  stop: noop,
  increment: noop,
  setDefaults: noop,

  install ({ $q, parentApp }) {
    $q.loadingBar = this

    if (__QUASAR_SSR_SERVER__) { return }

    if (this.__installed === true) {
      if ($q.config.loadingBar !== void 0) {
        this.setDefaults($q.config.loadingBar)
      }
      return
    }

    const props = ref(
      $q.config.loadingBar !== void 0
        ? { ...$q.config.loadingBar }
        : {}
    )

    const el = createGlobalNode('q-loading-bar')

    createChildApp({
      name: 'LoadingBar',

      // hide App from Vue devtools
      devtools: { hide: true },

      setup: () => () => h(QAjaxBar, { ...props.value, ref: barRef })
    }, parentApp).mount(el)

    Object.assign(this, {
      start (speed) {
        barRef.value.start(speed)
        Plugin.isActive = true
      },
      stop () {
        const sessions = barRef.value.stop()
        Plugin.isActive = sessions > 0
      },
      increment () {
        barRef.value.increment.apply(null, arguments)
      },
      setDefaults (opts) {
        if (opts === Object(opts)) {
          Object.assign(props.value, opts)
        }
      }
    })
  }
})

export default Plugin
