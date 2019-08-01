import Vue from 'vue'

import VirtualList from '../../mixins/virtual-list.js'

import { listenOpts } from '../../utils/event.js'

export default Vue.extend({
  name: 'QVirtualList',

  mixins: [ VirtualList ],

  props: {
    component: {
      type: [String, Object],
      default: 'div'
    },

    items: {
      type: Array,
      default: () => []
    },

    itemsFn: {
      type: Function
    },

    itemsSize: {
      type: Number
    },

    bgPlaceholder: Boolean,

    scrollTarget: {
      default: void 0
    }
  },

  computed: {
    virtualListLength () {
      return this.itemsSize >= 0 && this.itemsFn !== void 0
        ? parseInt(this.itemsSize, 10)
        : (Array.isArray(this.items) ? this.items.length : 0)
    },

    virtualListScope () {
      if (this.virtualListLength === 0) {
        return []
      }

      const mapFn = (item, i) => ({
        index: this.virtualListSliceRange.from + i,
        item
      })

      if (this.itemsFn === void 0) {
        return this.items.slice(this.virtualListSliceRange.from, this.virtualListSliceRange.to).map(mapFn)
      }

      return this.itemsFn(this.virtualListSliceRange.from, this.virtualListSliceRange.to - this.virtualListSliceRange.from).map(mapFn)
    },

    classes () {
      return 'q-virtual-list' + (this.horizontal === true ? '--horizontal' : '--vertical') +
        (this.scrollTarget !== void 0 ? '' : ' scroll')
    },

    attrs () {
      return this.scrollTarget !== void 0 ? void 0 : { tabindex: 0 }
    }
  },

  watch: {
    virtualListLength () {
      this.__resetVirtualList()
    },

    scrollTarget () {
      this.__unconfigureScrollTarget()
      this.__configureScrollTarget()
    }
  },

  methods: {
    __getVirtualListEl () {
      return this.$el
    },

    __getVirtualListScrollTarget () {
      return this.__scrollTarget
    },

    __configureScrollTarget () {
      let __scrollTarget = typeof this.scrollTarget === 'string' ? document.querySelector(this.scrollTarget) : this.scrollTarget

      if (__scrollTarget === void 0) {
        __scrollTarget = this.$el
      }
      else if (
        __scrollTarget === document ||
        __scrollTarget === document.body ||
        __scrollTarget === document.scrollingElement ||
        __scrollTarget === document.documentElement
      ) {
        __scrollTarget = window
      }

      this.__scrollTarget = __scrollTarget

      __scrollTarget.addEventListener('scroll', this.__onVirtualListScroll, listenOpts.passive)
    },

    __unconfigureScrollTarget () {
      if (this.__scrollTarget !== void 0) {
        this.__scrollTarget.removeEventListener('scroll', this.__onVirtualListScroll, listenOpts.passive)
        this.__scrollTarget = void 0
      }
    }
  },

  beforeMount () {
    this.__resetVirtualList()
  },

  mounted () {
    this.__configureScrollTarget()
  },

  beforeDestroy () {
    this.__unconfigureScrollTarget()
  },

  render (h) {
    if (this.$scopedSlots.default === void 0) {
      console.error(`VirtualList: default scoped slot is required for rendering`, this)
      return
    }

    return h(this.component, {
      staticClass: 'q-virtual-list',
      class: this.classes,
      attrs: this.attrs,
      props: this.$attrs,
      on: this.$listeners
    }, this.__padVirtualList(h, this.virtualListScope.map(this.$scopedSlots.default), this.bgPlaceholder))
  }
})
