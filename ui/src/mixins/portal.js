import { h, Teleport } from 'vue'

import { isSSR } from '../plugins/Platform.js'
// TODO vue3 - handle Fullscreen API
// import { getBodyFullscreenElement } from '../utils/dom.js'

let portalEl

export function closePortalMenus (vm, evt) {
  do {
    if (vm.$options.name === 'QMenu') {
      vm.hide(evt)

      // is this a point of separation?
      if (vm.separateClosePopup === true) {
        return vm.$parent
      }
    }
    else if (vm.__renderPortal !== void 0) {
      // treat it as point of separation if parent is QPopupProxy
      // (so mobile matches desktop behavior)
      // and hide it too
      if (vm.$parent !== void 0 && vm.$parent.$options.name === 'QPopupProxy') {
        vm.hide(evt)
        return vm.$parent
      }
      else {
        return vm
      }
    }
    vm = vm.$parent
  } while (vm !== void 0 && vm !== null)
}

export function closePortals (vm, evt, depth) {
  while (depth !== 0 && vm !== void 0 && vm !== null) {
    if (vm.__renderPortal !== void 0) {
      depth--

      if (vm.$options.name === 'QMenu') {
        vm = closePortalMenus(vm, evt)
        continue
      }

      vm.hide(evt)
    }

    vm = vm.$parent
  }
}

function isOnGlobalDialog (vm) {
  while (vm !== null) {
    if (vm.$options.name === 'QGlobalDialog') {
      return true
    }
    if (vm.$options.name === 'QDialog') {
      return false
    }

    vm = vm.$parent
  }
  return false
}

const Portal = {
  inheritAttrs: false,

  props: {
    contentClass: [ Array, String, Object ],
    contentStyle: [ Array, String, Object ]
  },

  data () {
    return {
      __portal: false
    }
  },

  methods: {
    __showPortal () {
      this.__portal = true
      // TODO vue3 - handle Fullscreen API
      // if (this.$q.fullscreen !== void 0 && this.$q.fullscreen.isCapable === true) {
      //   const append = isFullscreen => {
      //     if (this.__portal === void 0) {
      //       return
      //     }

      //     const newParent = getBodyFullscreenElement(
      //       isFullscreen,
      //       this.$q.fullscreen.activeEl
      //     )

      //     if (
      //       this.__portal.$el.parentElement !== newParent &&
      //       newParent.contains(this.$el) === (this.__onGlobalDialog === false)
      //     ) {
      //       newParent.appendChild(this.__portal.$el)
      //     }
      //   }

      //   this.unwatchFullscreen = this.$watch('$q.fullscreen.isActive', append)

      //   const isActive = this.$q.fullscreen.isActive

      //   if (this.__onGlobalDialog === false || isActive === true) {
      //     append(isActive)
      //   }
      // }
      // else if (this.__portal !== void 0 && this.__onGlobalDialog === false) {
      //   document.body.appendChild(portalEl)
      // }
    },

    __hidePortal () {
      this.__portal = false
      // if (this.__portal !== void 0) {
      //   if (this.unwatchFullscreen !== void 0) {
      //     this.unwatchFullscreen()
      //     this.unwatchFullscreen = void 0
      //   }

      //   if (this.__onGlobalDialog === false) {
      //     this.__portal.$destroy()
      //     this.__portal.$el.remove()
      //   }

      //   this.__portal = void 0
      // }
    }
  },

  render () {
    if (this.__portal === true) {
      return h(Teleport, { to: '#q-portal' }, this.__renderPortal())
    }
  }
}

if (isSSR === false) {
  portalEl = document.createElement('div')
  portalEl.id = 'q-portal'
  document.body.appendChild(portalEl)

  Portal.created = function () {
    this.__onGlobalDialog = isOnGlobalDialog(this.$parent)
  }
}

export default Portal
