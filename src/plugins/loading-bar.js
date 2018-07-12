import { isSSR } from './platform.js'
import QAjaxBar from '../components/ajax-bar/QAjaxBar.js'

export default {
  start () {},
  stop () {},
  increment () {},

  install ({ $q, Vue, cfg }) {
    if (isSSR) {
      $q.loadingBar = this
      return
    }

    const bar = $q.loadingBar = new Vue({
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
