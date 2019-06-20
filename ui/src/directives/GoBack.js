import Platform from '../plugins/Platform.js'

export default {
  name: 'go-back',

  bind (el, { value, modifiers }, vnode) {
    const ctx = {
      value,

      position: window.history.length - 1,
      single: modifiers.single,

      goBack () {
        const router = vnode.context.$router

        if (ctx.single) {
          router.go(-1)
        }
        else if (Platform.is.cordova === true) {
          router.go(ctx.position - window.history.length)
        }
        else {
          router.replace(ctx.value)
        }
      },

      goBackKey (e) {
        // ENTER
        e.keyCode === 13 && ctx.goBack()
      }
    }

    if (el.__qgoback) {
      el.__qgoback_old = el.__qgoback
    }

    el.__qgoback = ctx
    el.addEventListener('click', ctx.goBack)
    el.addEventListener('keyup', ctx.goBackKey)
  },

  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qgoback.value = value
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
