import Vue from 'vue'

export default {
  methods: {
    __showPortal () {
      if (this.__portal.showing !== true) {
        document.body.appendChild(this.__portal.$el)
        this.__portal.showing = true
      }
    },

    __hidePortal () {
      if (this.__portal.showing === true) {
        this.__portal.$el.remove()
        this.__portal.showing = false
      }
    }
  },

  render (h) {
    this.__portal !== void 0 && this.__portal.$forceUpdate()
    return null
  },

  beforeMount () {
    this.__portal = new Vue({
      render: h => this.__render(h),
      methods: {
        __qPortalClose: this.hide
      }
    }).$mount()
  },

  beforeDestroy () {
    this.__portal.$destroy()
    this.__portal.$el.remove()
    this.__portal = void 0
  }
}
