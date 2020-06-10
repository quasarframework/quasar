import Vue from 'vue'

import { getBodyFullscreenElement } from '../utils/dom.js'

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
  } while (vm !== void 0)
}

export function closePortals (vm, evt, depth) {
  while (depth !== 0 && vm !== void 0) {
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

export default {
  inheritAttrs: false,

  props: {
    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object]
  },

  methods: {
    __showPortal () {
      if (this.$q.fullscreen !== void 0 && this.$q.fullscreen.isCapable === true) {
        const append = isFullscreen => {
          if (this.__portal === void 0) {
            return
          }

          const newParent = getBodyFullscreenElement(
            isFullscreen,
            this.$q.fullscreen.activeEl
          )

          if (
            this.__portal.$el.parentElement !== newParent &&
            (
              // dialog plugin if the fullscreen element is not a child of it
              (
                this.$root !== void 0 &&
                this.$root.$options.name === 'QGlobalDialog' &&
                typeof this.__portal.$el.contains === 'function' &&
                this.__portal.$el.contains(newParent) === false
              ) ||
              // other components if they are children of fullscreen element
              newParent.contains(this.$el) === true
            )
          ) {
            newParent.appendChild(this.__portal.$el)
          }
        }

        this.unwatchFullscreen = this.$watch('$q.fullscreen.isActive', append)

        append(this.$q.fullscreen.isActive)
      }
      else if (this.__portal !== void 0) {
        document.body.appendChild(this.__portal.$el)
      }
    },

    __hidePortal () {
      if (this.__portal !== void 0) {
        if (this.unwatchFullscreen !== void 0) {
          this.unwatchFullscreen()
          this.unwatchFullscreen = void 0
        }

        this.__portal.$destroy()
        this.__portal.$el.remove()
        this.__portal = void 0
      }
    },

    __preparePortal () {
      if (this.__portal === void 0) {
        this.__portal = new Vue({
          name: 'QPortal',
          parent: this,

          inheritAttrs: false,

          render: h => this.__renderPortal(h),

          components: this.$options.components,
          directives: this.$options.directives
        }).$mount()
      }
    }
  },

  render () {
    this.__portal !== void 0 && this.__portal.$forceUpdate()
  },

  beforeDestroy () {
    this.__hidePortal()
  }
}
