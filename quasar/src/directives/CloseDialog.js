export default {
  name: 'close-dialog',

  bind (el, _, vnode) {
    const
      handler = ev => {
        const vm = vnode.componentInstance.$root

        if (vm.__qPortalClose !== void 0) {
          vm.__qPortalClose(ev)
        }
      },
      handlerKey = ev => {
        if (ev.keyCode === 13) {
          handler(ev)
        }
      }

    if (el.__qclosedialog) {
      el.__qclosedialog_old = el.__qclosedialog
    }

    el.__qclosedialog = { handler, handlerKey }
    el.addEventListener('click', handler)
    el.addEventListener('keyup', handlerKey)
  },

  unbind (el) {
    const ctx = el.__qclosedialog_old || el.__qclosedialog
    if (ctx === void 0) { return }

    el.removeEventListener('click', ctx.handler)
    el.removeEventListener('keyup', ctx.handlerKey)
    delete el[el.__qclosedialog_old ? '__qclosedialog_old' : '__qclosedialog']
  }
}
