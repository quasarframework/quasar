import { closeRootMenu } from '../components/menu/menu-tree.js'

export default {
  name: 'close-menu',

  bind (el, { value }, vnode) {
    const ctx = {
      enabled: value !== false,

      handler: () => {
        ctx.enabled !== false && closeRootMenu(vnode.componentInstance.$root.portalParentId)
      },

      handlerKey: ev => {
        ev.keyCode === 13 && ctx.handler(ev)
      }
    }

    if (el.__qclosemenu) {
      el.__qclosemenu_old = el.__qclosemenu
    }

    el.__qclosemenu = ctx
    el.addEventListener('click', ctx.handler)
    el.addEventListener('keyup', ctx.handlerKey)
  },

  update (el, { value }) {
    if (el.__qclosemenu !== void 0) {
      el.__qclosemenu.enabled = value !== false
    }
  },

  unbind (el) {
    const ctx = el.__qclosemenu_old || el.__qclosemenu
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el[el.__qclosemenu_old ? '__qclosemenu_old' : '__qclosemenu']
    }
  }
}
