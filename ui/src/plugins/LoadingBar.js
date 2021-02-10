import { h, ref } from 'vue'

import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { noop } from '../utils/event.js'
import { createGlobalNode } from '../utils/private/global-nodes.js'
import { createChildApp } from '../install-quasar.js'

import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

const reqProps = { ref: 'bar' }

export default defineReactivePlugin({
  isActive: false
}, {
  start: noop,
  stop: noop,
  increment: noop,
  setDefaults: noop,

  install ({ $q, cfg }) {
    if (__QUASAR_SSR_SERVER__) {
      $q.loadingBar = this
      return
    }

    const props = ref(
      cfg.loadingBar !== void 0
        ? { ...cfg.loadingBar, ...reqProps }
        : { ...reqProps }
    )

    const el = createGlobalNode('q-loading-bar')

    const vm = createChildApp({
      name: 'LoadingBar',
      setup: () => () => h(QAjaxBar, props.value)
    }).mount(el)

    Object.assign(this, {
      start: speed => {
        const bar = vm.$refs.bar
        bar.start(speed)
        this.isActive = bar.calls > 0
      },
      stop: () => {
        const bar = vm.$refs.bar
        bar.stop()
        this.isActive = bar.calls > 0
      },
      increment () {
        const bar = vm.$refs.bar
        bar.increment.apply(null, arguments)
      },
      setDefaults: opts => {
        if (opts === Object(opts)) {
          props.value = { ...props.value, ...opts, ...reqProps }
        }
      }
    })

    $q.loadingBar = this
  }
})
