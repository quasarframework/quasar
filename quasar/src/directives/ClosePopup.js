export default {
  name: 'close-popup',

  bind (el, { value, arg }, vnode) {
    const ctx = {
      enabled: value !== false,
      levels: arg,

      handler: ev => {
        if (ctx.enabled !== false) {
          const vm = vnode.componentInstance.$root
          console.log('popup-close', ctx.levels || 1)
          vm.__qClosePopup !== void 0 && vm.__qClosePopup(ev, ctx.levels || 1)
        }
      },

      handlerKey: ev => {
        ev.keyCode === 13 && ctx.handler(ev)
      }
    }

    if (el.__qclosepopup !== void 0) {
      el.__qclosepopup_old = el.__qclosepopup
    }

    el.__qclosepopup = ctx
    el.addEventListener('click', ctx.handler)
    el.addEventListener('keyup', ctx.handlerKey)
  },

  update (el, { value, arg }) {
    const ctx = el.__qclosepopup
    if (ctx !== void 0) {
      ctx.enabled = value !== false
      ctx.levels = arg
    }
  },

  unbind (el) {
    const ctx = el.__qclosepopup_old || el.__qclosepopup
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el[el.__qclosepopup_old ? '__qclosepopup_old' : '__qclosepopup']
    }
  }
}
