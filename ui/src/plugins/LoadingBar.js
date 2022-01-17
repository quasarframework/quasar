import Vue from 'vue'

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
    $q.loadingBar = this

    if (isSSR === true) {
      return
    }

    const props = cfg.loadingBar !== void 0
      ? { ...cfg.loadingBar }
      : {}

    const bar = new Vue({
      name: 'LoadingBar',

      // hide App from Vue devtools
      devtools: { hide: true },

      beforeCreate () {
        // prevent error in Vue devtools
        this._routerRoot === void 0 && (this._routerRoot = {})
      },

      render: h => h(QAjaxBar, {
        ref: 'bar',
        props
      })
    }).$mount().$refs.bar

    Object.assign(this, {
      start: speed => {
        bar.start(speed)
        this.isActive = bar.isActive = true
      },
      stop: () => {
        const sessions = bar.stop()
        this.isActive = bar.isActive = sessions > 0
      },
      increment: bar.increment,
      setDefaults: opts => {
        opts === Object(opts) && Object.assign(props, opts)
        bar.$parent.$forceUpdate()
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(bar, 'isActive', this.isActive)
    bar.setDefaults = this.setDefaults

    document.body.appendChild(bar.$parent.$el)
  }
}
