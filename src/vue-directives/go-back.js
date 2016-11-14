import Platform from '../features/platform'
import Utils from '../utils'

export default {
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

    Utils.store.add('goback', el, ctx)
    el.addEventListener('click', ctx.goBack)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('goback', el)
      ctx.value = binding.value
    }
  },
  unbind (el) {
    el.removeEventListener('click', Utils.store.get('goback', el).goBack)
    Utils.store.remove('goback', el)
  }
}
