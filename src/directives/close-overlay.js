export default {
  name: 'close-overlay',
  bind (el, binding, vnode) {
    const handler = ev => {
      let vm = vnode.componentInstance
      while ((vm = vm.$parent)) {
        const name = vm.$options.name
        if (name === 'QPopover' || name === 'QModal') {
          vm.hide(ev)
          break
        }
      }
    }
    el.__qclose = { handler }
    el.addEventListener('click', handler)
  },
  unbind (el) {
    const ctx = el.__qclose
    if (!ctx) { return }
    el.removeEventListener('click', ctx.handler)
    delete el.__qclose
  }
}
