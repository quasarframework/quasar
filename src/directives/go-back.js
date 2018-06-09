import Platform from '../plugins/platform'

export default {
  name: 'go-back',
  bind (el, { value, modifiers }, vnode) {
    let ctx = { value, position: window.history.length - 1, single: modifiers.single }

    if (Platform.is.cordova) {
      ctx.goBack = () => {
        vnode.context.$router.go(ctx.single ? -1 : ctx.position - window.history.length)
      }
    }
    else {
      ctx.goBack = () => {
        vnode.context.$router.replace(ctx.value)
      }
    }
    ctx.goBackKey = ev => {
      if (ev.keyCode === 13) {
        ctx.goBack(ev)
      }
    }

    el.__qgoback = ctx
    el.addEventListener('click', ctx.goBack)
    el.addEventListener('keyup', ctx.goBackKey)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qgoback.value = binding.value
    }
  },
  unbind (el) {
    const ctx = el.__qgoback
    if (!ctx) { return }
    el.removeEventListener('click', ctx.goBack)
    el.removeEventListener('keyup', ctx.goBackKey)
    delete el.__qgoback
  }
}
