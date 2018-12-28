import Vue from 'vue'

import { isSSR } from './Platform.js'
import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default {
  start () {},
  stop () {},
  increment () {},

  install ({ $q, cfg }) {
    if (isSSR) {
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

    Object.assign(this, {
      start: bar.start,
      stop: bar.stop,
      increment: bar.increment
    })

    document.body.appendChild($q.loadingBar.$parent.$el)
  }
}
