import extend from '../../utils/extend'
import { ready } from '../../utils/dom'
import Toast from './Toast.vue'
import { Vue } from '../../deps'

let
  toast,
  defaults,
  toastStack = [],
  installed = false,
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
    opts = extend(
      true,
      typeof opts === 'string' ? {html: opts} : opts,
      defaults
    )
  }

  if (!toast) {
    toastStack.push(opts)
    if (!installed) {
      install()
    }
    return
  }

  toast.create(opts)
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults)
})

function install () {
  installed = true
  ready(() => {
    let node = document.createElement('div')
    document.body.appendChild(node)
    toast = new Vue(Toast).$mount(node)
    if (defaults) {
      toast.setDefaults(defaults)
    }
    if (toastStack.length) {
      setTimeout(() => {
        toastStack.forEach(opts => {
          toast.create(opts)
        })
      }, 100)
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
  }
}
