import Vue from 'vue'

import { isSSR } from './Platform.js'
import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default {
  isActive: false,
  start () {},
  stop () {},
  increment () {},

  install ({ $q, cfg }) {
    if (isSSR === true) {
      $q.loadingBar = this
      return
    }

    const bar = $q.loadingBar = new Vue({
      name: 'LoadingBar',
      render: h => h(QAjaxBar, {
        ref: 'bar',
        props: cfg.loadingBar
      })
    }).$mount().$refs.bar

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(bar, 'isActive', this.isActive)

    Object.assign(this, {
      start: speed => {
        bar.start(speed)
        this.isActive = bar.isActive = bar.calls > 0
        console.log('++', bar.calls, this.isActive)
      },
      stop: () => {
        bar.stop()
        this.isActive = bar.isActive = bar.calls > 0
        console.log('--', bar.calls, this.isActive)
      },
      increment: bar.increment
    })

    document.body.appendChild($q.loadingBar.$parent.$el)
  }
}
