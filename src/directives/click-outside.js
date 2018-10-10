export default {
  name: 'click-outside',

  bind (el, { value, arg }) {
    const ctx = {
      trigger: value,
      handler (evt) {
        const target = evt && evt.target

        if (target) {
          if (el.contains(target)) {
            return
          }

          if (arg !== void 0) {
            for (let i = 0; i < arg.length; i++) {
              if (arg[i].contains(target)) {
                return
              }
            }
          }
        }

        ctx.trigger(evt)
      }
    }

    el.__qcloseoutside = ctx
    document.body.addEventListener('mousedown', ctx.handler, true)
    document.body.addEventListener('touchstart', ctx.handler, true)
  },

  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qcloseoutside.trigger = value
    }
  },

  unbind (el) {
    const ctx = el.__qcloseoutside
    if (ctx !== void 0) {
      document.body.removeEventListener('mousedown', ctx.handler, true)
      document.body.removeEventListener('touchstart', ctx.handler, true)
      delete el.__qcloseoutside
    }
  }
}
