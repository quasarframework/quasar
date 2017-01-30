import Utils from '../utils'

function equal (a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

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
        let matched
        const
          route = vnode.context.$route,
          router = vnode.context.$router,
          prop = ctx.route.name ? 'name' : 'path'

        if (ctx.route.exact) {
          matched = route[prop] === (typeof ctx.route === 'string' ? ctx.route : ctx.route[prop])
        }
        else {
          matched = equal(
            router.resolve(ctx.route, route).resolved.matched.map(r => r[prop]),
            route.matched.map(r => r[prop])
          )
        }

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
