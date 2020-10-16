import { createApp, h } from 'vue'

import defineReactivePlugin from '../utils/define-reactive-plugin.js'
import { noop } from '../utils/event.js'
import { createGlobalNode } from '../utils/global-nodes.js'

import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

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

    const props = cfg.loadingBar !== void 0
      ? { ...cfg.loadingBar }
      : {}

    props.ref = 'bar'

    const el = createGlobalNode('q-loading-bar')

    const app = createApp({
      name: 'LoadingBar',
      render: () => h(QAjaxBar, props)
    })

    app.config.globalProperties.$q = $q

    const bar = app.mount(el).$refs.bar

    Object.assign(this, {
      start: speed => {
        bar.start(speed)
        this.isActive = bar.calls > 0
      },
      stop: () => {
        bar.stop()
        this.isActive = bar.calls > 0
      },
      increment: bar.increment,
      setDefaults: opts => {
        opts === Object(opts) && Object.assign(props, opts)
        bar.$root.$forceUpdate()
      }
    })

    $q.loadingBar = this
  }
})
