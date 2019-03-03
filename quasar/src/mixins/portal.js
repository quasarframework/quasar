import Vue from 'vue'
import uid from '../utils/uid.js'

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

  data: () => ({
    portalId: uid()
  }),

  render () {
    this.__portal !== void 0 && this.__portal.$forceUpdate()
    return null
  },

  beforeMount () {
    const id = this.portalId

    if (inject === void 0) {
      fillInject(this.$root.$options)
    }

    this.__portal = new Vue({
      ...inject,

      render: h => this.__render(h),

      components: this.$options.components,
      directives: this.$options.directives,

      created () {
        this.portalParentId = id
      },

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
