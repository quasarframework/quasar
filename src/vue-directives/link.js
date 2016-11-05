import Utils from '../utils'

export default {
  bind (el, binding, vnode) {
    let ctx = {
      route: binding.value,
      delay: binding.modifiers.delay,
      active: false,
      go () {
        const fn = () => {
          vnode.context.$router[ctx.route.replace ? 'replace' : 'push'](ctx.route)
        }
        if (ctx.delay) {
          setTimeout(fn, 100)
          return
        }
        fn()
      },
      updateClass () {
        const
          route = vnode.context.$route,
          ctxRoute = typeof ctx.route === 'string' ? {path: ctx.route} : ctx.route,
          prop = ctxRoute.name ? 'name' : 'path'
        let matched = ctx.route.exact ? route[prop] === ctxRoute[prop] : route.matched.some(r => r[prop] === ctxRoute[prop])

        if (ctx.active !== matched) {
          el.classList[matched ? 'add' : 'remove']('router-link-active')
          ctx.active = matched
        }
      }
    }

    ctx.destroyWatcher = vnode.context.$watch('$route', ctx.updateClass)
    ctx.updateClass()
    Utils.store.add('link', el, ctx)
    el.addEventListener('click', ctx.go)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('link', el)
      ctx.route = binding.value
      ctx.updateClass()
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('link', el)
    ctx.destroyWatcher()
    el.removeEventListener('click', ctx.go)
    Utils.store.remove('link', el)
  }
}
