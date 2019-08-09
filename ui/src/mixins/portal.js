import Vue from 'vue'

export function closePortalMenus (vm, evt) {
  do {
    if (vm.$options.name === 'QMenu') {
      vm.hide(evt)
    }
    else if (vm.__hasPortal === true || vm.$options.name === 'QPopupProxy') {
      return vm
    }
    vm = vm.$parent
  } while (vm !== void 0)
}

export function closePortals (vm, evt, depth) {
  while (depth !== 0 && vm !== void 0) {
    if (vm.__hasPortal === true) {
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
    this.__hasPortal = true

    const obj = {
      name: 'QPortal',
      parent: this,

      inheritAttrs: false,

      render: h => this.__render(h),

      components: this.$options.components,
      directives: this.$options.directives
    }

    this.__portal = new Vue(obj).$mount()
  },

  beforeDestroy () {
    this.__portal.$destroy()
    this.__portal.$el.remove()
    this.__portal = void 0
  }
}
