import Alert from './Alert.vue'
import { Vue } from '../../deps'
import extend from '../../utils/extend'

function create (opts) {
  const node = document.createElement('div')
  document.body.appendChild(node)
  let active = true

  const vm = new Vue(extend({
    data () {
      return {
        visible: true,
        duration: opts.duration,
        name: opts.name,
        enter: opts.enter,
        leave: opts.leave,
        color: opts.color,
        icon: opts.icon,
        html: opts.html,
        buttons: opts.buttons,
        position: opts.position || 'top-right'
      }
    }
  }, Alert))

  vm.close = () => {
    if (!active) {
      return
    }
    active = false
    vm.$destroy()
    vm.$el.parentNode.removeChild(vm.$el)
    if (opts.onDismiss) {
      opts.onDismiss()
    }
  }
  vm.$on('dismissed', vm.close)
  vm.$mount(node)

  return {
    dismiss: vm.dismiss
  }
}

export default {
  create
}
