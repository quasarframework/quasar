import Utils from '../utils'

export default {
  bind (el, binding, vnode) {
    let ctx = {
      replace: binding.replace,
      route: binding.value,
      go () {
        vnode.context.$router[ctx.replace ? 'replace' : 'push'](ctx.route)
      }
    }

    Utils.store.add('link', el, ctx)
    el.addEventListener('click', ctx.go)
  },
  update (el, binding) {
    let ctx = Utils.store.get('link', el)
    if (binding.oldValue !== binding.value) {
      ctx.route = binding.value
    }
    if (binding.replace !== ctx.replace) {
      ctx.replace = binding.replace
    }
  },
  unbind (el) {
    el.removeEventListener('click', Utils.store.get('link', el).go)
    Utils.store.remove('link', el)
  }
}
