import { h, Teleport } from 'vue'

import { isSSR } from '../plugins/Platform.js'
import { createGlobalNode, removeGlobalNode } from '../utils/global-nodes.js'
import { noop } from '../utils/event.js'

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

const Portal = {
  inheritAttrs: false,

  props: {
    contentClass: [ Array, String, Object ],
    contentStyle: [ Array, String, Object ]
  }
}

if (isSSR === false) {
  Object.assign(Portal, {
    data () {
      return {
        usePortal: false
      }
    },

    methods: {
      __showPortal () {
        if (this.__onGlobalDialog === false) {
          this.__portalEl = createGlobalNode()
        }

        this.usePortal = true
      },

      __hidePortal () {
        this.usePortal = false

        if (this.__onGlobalDialog === false) {
          removeGlobalNode(this.__portalEl)
        }
      }
    },

    render () {
      return this.__onGlobalDialog === true
        ? this.__renderPortal()
        : (this.usePortal === true
          ? h(Teleport, { to: this.__portalEl }, this.__renderPortal())
          : void 0)
    },

    created () {
      this.__onGlobalDialog = this.$root.$.type.name === 'QGlobalDialog'
    },

    unmounted () {
      if (this.usePortal === true && this.__onGlobalDialog === false) {
        removeGlobalNode(this.__portalEl)
      }
    }
  })
}
else {
  Portal.render = noop
}

export default Portal
