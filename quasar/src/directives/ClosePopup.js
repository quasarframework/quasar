export default {
  name: 'close-popup',

  bind (el, { value }, vnode) {
    const ctx = {
      enabled: value !== false,

      handler: ev => {
        if (ctx.enabled !== false) {
          const vm = (vnode.componentInstance || vnode.context).$root
          vm.__qClosePopup !== void 0 && vm.__qClosePopup(ev)
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

  update (el, { value }) {
    if (el.__qclosepopup !== void 0) {
      el.__qclosepopup.enabled = value !== false
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
