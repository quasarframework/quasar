import Vue from 'vue'

import { isSSR } from './Platform.js'
import { noop } from '../utils/event.js'
import { isObject } from '../utils/is.js'
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
    const on = {
      start: () => {
        this.isActive = true
      },

      stop: () => {
        this.isActive = false
      }
    }

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
        props,
        on
      })
    }).$mount().$refs.bar

    Object.assign(this, {
      start: bar.start,
      stop: bar.stop,
      increment: bar.increment,
      setDefaults: opts => {
        isObject(opts) === true && Object.assign(props, opts)
        bar.$parent.$forceUpdate()
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(bar, 'isActive', this.isActive)
    bar.setDefaults = this.setDefaults

    document.body.appendChild(bar.$parent.$el)
  }
}
