import { closeRootMenu } from '../components/menu/menu-tree.js'

export default {
  name: 'close-menu',

  bind (el, _, vnode) {
    const
      handler = () => {
        closeRootMenu(vnode.componentInstance.$root.portalParentId)
      },
      handlerKey = evt => {
        evt.keyCode === 13 && handler(evt)
      }

    el.__qclosemenu = { handler, handlerKey }
    el.addEventListener('click', handler)
    el.addEventListener('keyup', handlerKey)
  },

  unbind (el) {
    const ctx = el.__qclosemenu
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el.__qclosemenu
    }
  }
}
