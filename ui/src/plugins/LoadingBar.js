import { createApp, h } from 'vue'

import { isSSR } from './Platform.js'
import { noop } from '../utils/event.js'
import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default {
  isActive: false,
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

    // TODO vue3 - injection of $q

    // const el = document.createElement('div')
    // document.body.appendChild(el)

    // const bar = $q.loadingBar = createApp({
    //   name: 'LoadingBar',
    //   render: () => h(QAjaxBar, {
    //     ref: 'bar',
    //     props
    //   })
    // }).mount(el).$refs.bar

    // Object.assign(this, {
    //   start: speed => {
    //     bar.start(speed)
    //     this.isActive = bar.isActive = bar.calls > 0
    //   },
    //   stop: () => {
    //     bar.stop()
    //     this.isActive = bar.isActive = bar.calls > 0
    //   },
    //   increment: bar.increment,
    //   setDefaults: opts => {
    //     opts === Object(opts) && Object.assign(props, opts)
    //     bar.$parent.$forceUpdate()
    //   }
    // })

    // TODO vue3
    // Vue.util.defineReactive(this, 'isActive', this.isActive)
    // Vue.util.defineReactive(bar, 'isActive', this.isActive)

    // bar.setDefaults = this.setDefaults
  }
}
