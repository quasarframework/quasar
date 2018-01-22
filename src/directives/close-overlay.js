export default {
  name: 'close-overlay',
  bind (el, binding, vnode) {
    const handler = () => {
      let vm = vnode.componentInstance
      while ((vm = vm.$parent)) {
        const name = vm.$options.name
        if (name === 'q-popover' || name === 'q-modal') {
          vm.hide()
          break
        }
      }
    }
    el.__qclose = { handler }
    el.addEventListener('click', handler)
  },
  unbind (el) {
    el.removeEventListener('click', el.__qclose.handler)
    delete el.__qclose
  }
}
