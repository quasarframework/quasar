import { h, ref } from 'vue'

import QAjaxBar from '../../components/ajax-bar/QAjaxBar.js'
import { createChildApp } from '../../install-quasar.js'

import { createReactivePlugin } from '../../utils/private.create/create.js'
import { noop } from '../../utils/event/event.js'
import { createGlobalNode } from '../../utils/private.config/nodes.js'
import { isObject } from '../../utils/is/is.js'

const barRef = ref(null)

const Plugin = createReactivePlugin({
  isActive: false
}, {
  start: noop,
  stop: noop,
  increment: noop,
  setDefaults: noop,

  install ({ $q, parentApp }) {
    $q.loadingBar = this

    if (__QUASAR_SSR_SERVER__) return

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

    function onStart () {
      Plugin.isActive = true
    }

    function onStop () {
      Plugin.isActive = false
    }

    const el = createGlobalNode('q-loading-bar')

    createChildApp({
      name: 'LoadingBar',

      // hide App from Vue devtools
      devtools: { hide: true },

      setup: () => () => h(QAjaxBar, { ...props.value, onStart, onStop, ref: barRef })
    }, parentApp).mount(el)

    Object.assign(this, {
      start (speed) {
        barRef.value.start(speed)
      },
      stop () {
        barRef.value.stop()
      },
      increment () {
        barRef.value.increment.apply(null, arguments)
      },
      setDefaults (opts) {
        if (isObject(opts) === true) {
          Object.assign(props.value, opts)
        }
      }
    })
  }
})

export default Plugin
