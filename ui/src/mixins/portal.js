import { h, Teleport } from 'vue'

import { isSSR } from '../plugins/Platform.js'
import { createGlobalNode, removeGlobalNode } from '../utils/global-nodes.js'
import { noop } from '../utils/event.js'
import { getParentVm } from '../utils/vm.js'

const portalList = []

export function getPortalVm (el) {
  return portalList
    .map(fn => fn())
    .find(vm => vm.$refs && vm.$refs.inner && vm.$refs.inner.contains(el))
}

export function closePortalMenus (vm, evt) {
  do {
    if (vm.$options.name === 'QMenu') {
      vm.hide(evt)

      // is this a point of separation?
      if (vm.$props.separateClosePopup === true) {
        return getParentVm(vm)
      }
    }
    else if (vm.__renderPortal !== void 0) {
      // treat it as point of separation if parent is QPopupProxy
      // (so mobile matches desktop behavior)
      // and hide it too
      const parent = getParentVm(vm)

      if (parent !== void 0 && parent.$options.name === 'QPopupProxy') {
        vm.hide(evt)
        return parent
      }
      else {
        return vm
      }
    }

    vm = getParentVm(vm)
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

    vm = getParentVm(vm)
  }
}

const Portal = {
  // inheritAttrs in mixins is not inherited
  // so specify "inheritAttrs: false" in your component,

  props: {
    contentClass: [ Array, String, Object ],
    contentStyle: [ Array, String, Object ]
  }
}

if (isSSR === true) {
  Portal.render = noop
}
else {
  Object.assign(Portal, {
    data () {
      return { usePortal: false }
    },

    methods: {
      __showPortal () {
        if (this.__onGlobalDialog === false) {
          this.__portalEl = createGlobalNode()
        }

        this.usePortal = true

        // register portal
        portalList.push(this.__getPortalVm)
      },

      __hidePortal () {
        this.usePortal = false

        // unregister portal
        const index = portalList.indexOf(this.__getPortalVm)
        if (index > -1) {
          portalList.splice(index, 1)
        }

        if (this.__portalEl !== null) {
          removeGlobalNode(this.__portalEl)
          this.__portalEl = null
        }
      },

      // we use a reference that won't change between
      // re-renders for the click-outside management
      __getPortalVm () {
        return this
      }
    },

    render () {
      return this.__onGlobalDialog === true
        ? this.__renderPortal()
        : (
          this.usePortal === true
            ? [ h(Teleport, { to: this.__portalEl }, this.__renderPortal()) ]
            : void 0
        )
    },

    created () {
      this.__portalEl = null
      this.__onGlobalDialog = this.$root.$.type.name === 'QGlobalDialog'
    },

    unmounted () {
      this.__hidePortal()
    }
  })
}

export default Portal
