import { Vue } from '../install'

export default function (VueComponent) {
  return {
    create (props) {
      const node = document.createElement('div')
      document.body.appendChild(node)

      /* eslint-disable no-new */
      new Vue({
        el: node,
        data () {
          return {props}
        },
        render: h => h(VueComponent, {props})
      })
    }
  }
}
