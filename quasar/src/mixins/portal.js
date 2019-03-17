import Vue from 'vue'

let inject

function fillInject (root) {
  const
    options = (new Vue()).$root.$options,
    skip = ['el', 'created', 'activated', 'deactivated', 'beforeMount', 'methods', 'mounted', 'render', 'mixins']
      .concat(Object.keys(options).filter(key => options[key] !== null))

  inject = {}

  Object.keys(root)
    .filter(name => skip.includes(name) === false)
    .forEach(p => {
      inject[p] = root[p]
    })
}

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
    if (inject === void 0) {
      fillInject(this.$root.$options)
    }

    const obj = {
      ...inject,

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

    this.__portal = new Vue(obj).$mount()
  },

  beforeDestroy () {
    this.__portal.$destroy()
    this.__portal.$el.remove()
    this.__portal = void 0
  }
}
