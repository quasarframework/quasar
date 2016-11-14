import { Vue } from '../vue-install'

export default function (VueComponent) {
  return {
    create (props) {
      const node = document.createElement('div')
      document.body.appendChild(node)

      let vm = new Vue({
        el: node,
        data () {
          return {props}
        },
        render: h => h(VueComponent, {props})
      })

      return {
        close (fn) {
          vm.quasarClose(fn)
        }
      }
    }
  }
}
