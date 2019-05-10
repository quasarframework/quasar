import Vue from 'vue'

import { isSSR } from './Platform.js'
import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default {
  isActive: false,
  start () {},
  stop () {},
  increment () {},
  setDefaults () {},

  install ({ $q, cfg }) {
    if (isSSR === true) {
      $q.loadingBar = this
      return
    }

    let props = cfg.loadingBar !== void 0
      ? { ...cfg.loadingBar }
      : {}

    const bar = $q.loadingBar = new Vue({
      name: 'LoadingBar',
      render: h => h(QAjaxBar, {
        ref: 'bar',
        props
      })
    }).$mount().$refs.bar

    Object.assign(this, {
      start: speed => {
        bar.start(speed)
        this.isActive = bar.isActive = bar.calls > 0
      },
      stop: () => {
        bar.stop()
        this.isActive = bar.isActive = bar.calls > 0
      },
      increment: bar.increment,
      setDefaults: def => {
        Object.assign(props, def || {})
        bar.$parent.$forceUpdate()
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(bar, 'isActive', this.isActive)
    bar.setDefaults = this.setDefaults

    document.body.appendChild(bar.$parent.$el)
  }
}
