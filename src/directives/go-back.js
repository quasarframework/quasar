import Platform from '../features/platform'
import { add, get, remove } from '../utils/store'

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

    add('goback', el, ctx)
    el.addEventListener('click', ctx.goBack)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = get('goback', el)
      ctx.value = binding.value
    }
  },
  unbind (el) {
    el.removeEventListener('click', get('goback', el).goBack)
    remove('goback', el)
  }
}
