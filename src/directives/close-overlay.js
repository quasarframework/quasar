export default {
  name: 'close-overlay',
  bind (el, binding, vnode) {
    const
      handler = ev => {
        let vm = vnode.componentInstance
        while ((vm = vm.$parent)) {
          const name = vm.$options.name
          if (name === 'QPopover' || name === 'QModal') {
            vm.hide(ev)
            break
          }
        }
      },
      handlerKey = ev => {
        if (ev.keyCode === 13) {
          handler(ev)
        }
      }
    el.__qclose = { handler, handlerKey }
    el.addEventListener('click', handler)
    el.addEventListener('keyup', handlerKey)
  },
  unbind (el) {
    const ctx = el.__qclose
    if (!ctx) { return }
    el.removeEventListener('click', ctx.handler)
    el.removeEventListener('keyup', ctx.handlerKey)
    delete el.__qclose
  }
}
