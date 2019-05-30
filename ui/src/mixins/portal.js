import { getVm } from '../utils/vm.js'

export default {
  inheritAttrs: false,

  props: {
    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object]
  },

  methods: {
    __showPortal () {
      if (this.__portal !== void 0 && this.__portal.showing !== true) {
        document.body.appendChild(this.__portal.$el)
        this.__portal.showing = true
      }
    },

    __hidePortal () {
      if (this.__portal !== void 0 && this.__portal.showing === true) {
        this.__portal.$el.remove()
        this.__portal.showing = false
      }
    }
  },

  render () {
    this.__portal !== void 0 && this.__portal.$forceUpdate()
  },

  beforeMount () {
    const obj = {
      inheritAttrs: false,

      render: h => this.__render(h),

      components: this.$options.components,
      directives: this.$options.directives
    }

    if (this.__onPortalClose !== void 0) {
      obj.methods = {
        __qClosePopup: this.__onPortalClose
      }
    }

    const onCreated = this.__onPortalCreated

    if (onCreated !== void 0) {
      obj.created = function () {
        onCreated(this)
      }
    }

    this.__portal = getVm(this, obj).$mount()
  },

  beforeDestroy () {
    if (this.__portal !== void 0) {
      this.__portal.$destroy()
      this.__portal.$el.remove()
      this.__portal = void 0
    }
  }
}
