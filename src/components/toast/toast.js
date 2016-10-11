import Utils from '../../utils'
import Events from '../../events'
import Toast from './toast.vue'

let
  toast,
  types = [
    {
      name: 'positive',
      defaults: {icon: 'check', classes: 'bg-positive'}
    },
    {
      name: 'negative',
      defaults: {icon: 'whatshot', classes: 'bg-negative'}
    },
    {
      name: 'info',
      defaults: {icon: 'info', classes: 'bg-info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning', classes: 'bg-warning'}
    }
  ]

Events.on('app:vue-ready', (_Vue) => {
  let node = document.createElement('div')
  document.body.appendChild(node)
  toast = new _Vue(Toast).$mount(node)
})

function create (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  if (defaults) {
    opts = Utils.extend(
      true,
      typeof opts === 'string' ? {html: opts} : opts,
      defaults
    )
  }

  toast.create(opts)
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults)
})

export default {
  create,
  setDefaults (opts) {
    toast.setDefaults(opts)
  }
}
