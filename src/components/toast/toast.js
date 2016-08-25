import Events from '../../events'
import Toast from './toast.vue'

let toast

Events.on('app:vue-ready', (_Vue) => {
  toast = new _Vue(Toast)
  toast.$mount().$appendTo(document.body)
})

export default {
  create (opts) {
    toast.create(opts)
  }
}
