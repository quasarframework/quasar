import Utils from '../../utils'
import Toast from './Toast.vue'

let
  toast,
  defaults,
  toastStack = [],
  types = [
    {
      name: 'positive',
      defaults: {icon: 'check', classes: 'bg-positive'}
    },
    {
      name: 'negative',
      defaults: {icon: 'error', classes: 'bg-negative'}
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

  if (!toast) {
    toastStack.push(opts)
    return
  }

  toast.create(opts)
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults)
})

export function install (_Vue) {
  Utils.dom.ready(() => {
    let node = document.createElement('div')
    document.body.appendChild(node)
    toast = new _Vue(Toast).$mount(node)
    if (defaults) {
      toast.setDefaults(defaults)
    }
    if (toastStack.length) {
      toastStack.forEach(opts => {
        toast.create(opts)
      })
    }
  })
}

export default {
  create,
  setDefaults (opts) {
    if (toast) {
      toast.setDefaults(opts)
    }
    else {
      defaults = opts
    }
  },
  install
}
