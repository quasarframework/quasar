import { client } from '../plugins/Platform.js'
import { isKeyCode } from '../utils/key-composition.js'

export default {
  name: 'go-back',

  bind (el, { value, modifiers }, vnode) {
    const ctx = {
      value,

      position: window.history.length - 1,
      single: modifiers.single,

      goBack () {
        const router = vnode.context.$router

        if (ctx.single === true) {
          router.go(-1)
        }
        else if (client.is.nativeMobile === true) {
          router.go(ctx.position - window.history.length)
        }
        else {
          router.replace(ctx.value)
        }
      },

      goBackKey (e) {
        // if ENTER key
        isKeyCode(e, 13) === true && ctx.goBack()
      }
    }

    if (el.__qgoback) {
      el.__qgoback_old = el.__qgoback
    }

    el.__qgoback = ctx
    el.addEventListener('click', ctx.goBack)
    el.addEventListener('keyup', ctx.goBackKey)
  },

  update (el, { value, oldValue, modifiers }) {
    const ctx = el.__qgoback

    if (ctx !== void 0) {
      if (value !== oldValue) {
        ctx.value = value
      }

      if (ctx.single !== modifiers.single) {
        ctx.single = modifiers.single
      }
    }
  },

  unbind (el) {
    const ctx = el.__qgoback_old || el.__qgoback
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.goBack)
      el.removeEventListener('keyup', ctx.goBackKey)
      delete el[el.__qgoback_old ? '__qgoback_old' : '__qgoback']
    }
  }
}
