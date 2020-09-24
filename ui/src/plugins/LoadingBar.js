import { createApp, h } from 'vue'

import defineReactivePlugin from '../utils/define-reactive-plugin.js'
import { isSSR } from './Platform.js'
import { noop } from '../utils/event.js'
import { getAppVm } from '../utils/vm.js'

import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default defineReactivePlugin({
  isActive: false
}, {
  start: noop,
  stop: noop,
  increment: noop,
  setDefaults: noop,

  install ({ $q, cfg }) {
    if (isSSR === true) {
      $q.loadingBar = this
      return
    }

    const props = cfg.loadingBar !== void 0
      ? { ...cfg.loadingBar }
      : {}

    props.ref = 'bar'

    const el = document.createElement('div')
    document.body.appendChild(el)

    const app = createApp({
      name: 'LoadingBar',
      render: () => h(QAjaxBar, props)
    })

    app.config.globalProperties.$q = $q
    app.mount(el)

    const bar = getAppVm(app).$refs.bar

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
