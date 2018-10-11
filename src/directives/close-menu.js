export default {
  name: 'close-menu',

  bind (el, _, vnode) {
    const
      handler = evt => {
        let vm = vnode.componentInstance
        if (vm.$root.__qPortalClose !== void 0) {
          vm.$root.__qPortalClose(evt)
        }
      },
      handlerKey = evt => {
        evt.keyCode === 13 && handler(evt)
      }

    el.__qclose = { handler, handlerKey }
    el.addEventListener('click', handler)
    el.addEventListener('keyup', handlerKey)
  },

  unbind (el) {
    const ctx = el.__qclose
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el.__qclose
    }
  }
}
