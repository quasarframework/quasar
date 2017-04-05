import { Vue } from '../deps'

export default function (component) {
  return {
    create (props) {
      const node = document.createElement('div')
      document.body.appendChild(node)

      let vm = new Vue({
        el: node,
        data () {
          return {props}
        },
        render: h => h(component, {props})
      })

      return {
        vm,
        close (fn) {
          vm.quasarClose(fn)
        }
      }
    }
  }
}
