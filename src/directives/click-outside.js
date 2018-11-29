export default {
  name: 'click-outside',

  bind (el, { value, arg }) {
    const ctx = {
      trigger: value,
      handler (evt) {
        const target = evt && evt.target

        if (target && target !== document.body) {
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

          let parent = target
          while ((parent = parent.parentNode) !== document.body) {
            if (parent.classList.contains('q-menu')) {
              return
            }
          }
        }

        ctx.trigger(evt)
      }
    }

    if (el.__qclickoutside) {
      el.__qclickoutside_old = el.__qclickoutside
    }

    el.__qclickoutside = ctx
    document.body.addEventListener('mousedown', ctx.handler, true)
    document.body.addEventListener('touchstart', ctx.handler, true)
  },

  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qclickoutside.trigger = value
    }
  },

  unbind (el) {
    const ctx = el.__qclickoutside_old || el.__qclickoutside
    if (ctx !== void 0) {
      document.body.removeEventListener('mousedown', ctx.handler, true)
      document.body.removeEventListener('touchstart', ctx.handler, true)
      delete el[el.__qclickoutside_old ? '__qclickoutside_old' : '__qclickoutside']
    }
  }
}
