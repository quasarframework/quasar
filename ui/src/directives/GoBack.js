import { client } from '../plugins/Platform.js'
import { isKeyCode } from '../utils/key-composition.js'

export default {
  name: 'go-back',

  beforeMount (el, { value, modifiers }, vnode) {
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

    el.__qgoback = ctx

    el.addEventListener('click', ctx.goBack)
    el.addEventListener('keyup', ctx.goBackKey)
  },

  updated (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qgoback.value = value
    }
  },

  beforeUnmount (el) {
    const ctx = el.__qgoback
    el.removeEventListener('click', ctx.goBack)
    el.removeEventListener('keyup', ctx.goBackKey)
    delete el.__qgoback
  }
}
