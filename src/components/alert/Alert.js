import QAlert from './QAlert.vue'
import { Vue } from '../../deps'
import extend from '../../utils/extend'

function create (opts) {
  const node = document.createElement('div')
  document.body.appendChild(node)

  const state = extend({position: 'top-right'}, opts, {value: true, appear: true, dismissible: !opts.actions || !opts.actions.length})

  const vm = new Vue({
    functional: true,
    render (h, ctx) {
      return h(
        QAlert, {
          style: {
            margin: '18px'
          },
          props: state,
          on: {
            dismiss () {
              vm.$destroy()
              vm.$el.parentNode.removeChild(vm.$el)
              if (opts.onDismiss) {
                opts.onDismiss()
              }
            }
          }
        },
        opts.html
      )
    }
  })

  vm.$mount(node)

  return {
    dismiss () {
      state.value = false
      vm.$forceUpdate()
    }
  }
}

export default {
  create
}
