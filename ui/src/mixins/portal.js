import Vue from 'vue'

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
    const setPortalVNode = () => {
      if (this.__portal !== void 0 && this.__portal.$el !== void 0) {
        this.__portal.$el.__qPortalVM = this
      }
    }

    const obj = {
      name: 'QPortal',

      inheritAttrs: false,

      mounted: setPortalVNode,
      updated: setPortalVNode,

      render: h => this.__render(h),

      components: this.$options.components,
      directives: this.$options.directives,
      parent: this
    }

    this.__portal = (new Vue(obj)).$mount()
  },

  beforeDestroy () {
    this.__portal.$destroy()
    this.__portal.$el.remove()
    this.__portal = void 0
  }
}
