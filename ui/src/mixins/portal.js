import Vue from 'vue'

import { isSSR } from '../plugins/Platform.js'
import { getBodyFullscreenElement } from '../utils/dom.js'
import { addFocusWaitFlag, removeFocusWaitFlag } from '../utils/private/focus-manager.js'
import debounce from '../utils/debounce.js'

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
  } while (
    vm !== void 0 && (
      vm.$el.contains === void 0 || // IE polyfill does not work on comments
      vm.$el.contains(evt.target) !== true
    )
  )
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

function isOnGlobalDialog (vm) {
  while (vm !== void 0) {
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

export function getPortalsContainer (fullscreenElement) {
  let container = [...fullscreenElement.children].find(el => el.matches && el.matches('.q-portal__container'))

  if (container === void 0) {
    container = document.createElement('div')
    container.classList.add('q-portal__container')
  }

  if (container.parentElement !== fullscreenElement || container.nextElementSibling !== null) {
    fullscreenElement.appendChild(container)
  }

  return container
}

const Portal = {
  inheritAttrs: false,

  props: {
    contentClass: [ Array, String, Object ],
    contentStyle: [ Array, String, Object ]
  },

  methods: {
    __showPortal (isReady) {
      if (isReady === true) {
        removeFocusWaitFlag(this.focusObj)
        this.__portalIsAccessible = true
        return
      }

      this.__portalIsAccessible = false

      if (this.__portalIsActive === true) { return }
      this.__portalIsActive = true

      if (this.focusObj === void 0) {
        this.focusObj = {}
      }

      addFocusWaitFlag(this.focusObj)

      if (this.$q.fullscreen !== void 0 && this.$q.fullscreen.isCapable === true) {
        const append = () => {
          if (this.__portal === void 0) {
            return
          }

          const
            newParent = getBodyFullscreenElement(this.$q.fullscreen.activeEl),
            oldContainer = this.__portal.$el.parentElement,
            newContainer = getPortalsContainer(newParent)

          if (
            oldContainer !== newContainer &&
            (this.__onGlobalDialog === true || newParent.contains(this.$el) === true)
          ) {
            newContainer.appendChild(this.__portal.$el)

            if (oldContainer && oldContainer.parentElement !== document.body && oldContainer.children.length === 0) {
              oldContainer.remove()
            }
          }
        }

        this.unwatchFullscreen = this.$watch('$q.fullscreen.activeEl', debounce(append, 50))

        if (this.__onGlobalDialog === false || this.$q.fullscreen.isActive === true) {
          append()
        }
      }
      else if (this.__portal !== void 0 && this.__onGlobalDialog === false) {
        getPortalsContainer(document.body).appendChild(this.__portal.$el)
      }
    },

    __hidePortal (isReady) {
      this.__portalIsAccessible = false

      if (isReady !== true) { return }

      this.__portalIsActive = false
      removeFocusWaitFlag(this.focusObj)

      if (this.__portal !== void 0) {
        if (this.unwatchFullscreen !== void 0) {
          this.unwatchFullscreen()
          this.unwatchFullscreen = void 0
        }

        if (this.__onGlobalDialog === false) {
          this.__portal.$destroy()
          this.__portal.$el.remove()
        }

        const container = this.__portal.$el.parentElement
        if (container && container.parentElement !== document.body && container.children.length === 0) {
          container.remove()
        }

        this.__portal = void 0
      }
    },

    __preparePortal () {
      if (this.__portal === void 0) {
        this.__portal = this.__onGlobalDialog === true
          ? {
            $el: this.$el,
            $refs: this.$refs
          }
          : new Vue({
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

  render (h) {
    if (this.__onGlobalDialog === true) {
      return this.__renderPortal(h)
    }

    if (this.__portal !== void 0) {
      this.__portal.$forceUpdate()
    }
  },

  beforeDestroy () {
    this.__hidePortal(true)
  }
}

if (isSSR === false) {
  Portal.created = function () {
    this.__onGlobalDialog = isOnGlobalDialog(this.$parent)
  }
}

export default Portal
