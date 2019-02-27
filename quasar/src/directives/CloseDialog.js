export default {
  name: 'close-dialog',

  bind (el, { value }, vnode) {
    const ctx = {
      enabled: value !== false,

      handler: ev => {
        const vm = vnode.componentInstance.$root

        if (ctx.enabled !== false && vm.__qPortalClose !== void 0) {
          vm.__qPortalClose(ev)
        }
      },

      handlerKey: ev => {
        ev.keyCode === 13 && ctx.handler(ev)
      }
    }

    if (el.__qclosedialog) {
      el.__qclosedialog_old = el.__qclosedialog
    }

    el.__qclosedialog = ctx
    el.addEventListener('click', ctx.handler)
    el.addEventListener('keyup', ctx.handlerKey)
  },

  update (el, { value }) {
    if (el.__qclosedialog !== void 0) {
      el.__qclosedialog.enabled = value !== false
    }
  },

  unbind (el) {
    const ctx = el.__qclosedialog_old || el.__qclosedialog
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el[el.__qclosedialog_old ? '__qclosedialog_old' : '__qclosedialog']
    }
  }
}
