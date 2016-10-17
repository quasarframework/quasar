import { Vue } from '../../install'
import Dialog from './dialog.vue'

export default {
  create (props) {
    const node = document.createElement('div')
    document.body.appendChild(node)

    /* eslint-disable no-new */
    new Vue({
      el: node,
      data () {
        return {props}
      },
      render: h => h(Dialog, {props})
    })
  }
}
