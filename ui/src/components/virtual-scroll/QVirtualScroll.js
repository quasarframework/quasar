import Vue from 'vue'

import QList from '../list/QList.js'
import QMarkupTable from '../table/QMarkupTable.js'
import getTableMiddle from '../table/get-table-middle.js'
import VirtualScroll from '../../mixins/virtual-scroll.js'

import { listenOpts } from '../../utils/event.js'

const comps = {
  list: QList,
  table: QMarkupTable
}

export default Vue.extend({
  name: 'QVirtualScroll',

  mixins: [ VirtualScroll ],

  props: {
    type: {
      type: String,
      default: 'list',
      validator: v => ['list', 'table', '__qtable'].includes(v)
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

    scrollTarget: {
      default: void 0
    }
  },

  computed: {
    virtualScrollLength () {
      return this.itemsSize >= 0 && this.itemsFn !== void 0
        ? parseInt(this.itemsSize, 10)
        : (Array.isArray(this.items) ? this.items.length : 0)
    },

    virtualScrollScope () {
      if (this.virtualScrollLength === 0) {
        return []
      }

      const mapFn = (item, i) => ({
        index: this.virtualScrollSliceRange.from + i,
        item
      })

      if (this.itemsFn === void 0) {
        return this.items.slice(this.virtualScrollSliceRange.from, this.virtualScrollSliceRange.to).map(mapFn)
      }

      return this.itemsFn(this.virtualScrollSliceRange.from, this.virtualScrollSliceRange.to - this.virtualScrollSliceRange.from).map(mapFn)
    },

    classes () {
      return 'q-virtual-scroll q-virtual-scroll' + (this.virtualScrollHorizontal === true ? '--horizontal' : '--vertical') +
        (this.scrollTarget !== void 0 ? '' : ' scroll')
    },

    attrs () {
      return this.scrollTarget !== void 0 ? void 0 : { tabindex: 0 }
    }
  },

  watch: {
    virtualScrollLength () {
      this.__resetVirtualScroll()
    },

    scrollTarget () {
      this.__unconfigureScrollTarget()
      this.__configureScrollTarget()
    }
  },

  methods: {
    __getVirtualScrollEl () {
      return this.$el
    },

    __getVirtualScrollTarget () {
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

      __scrollTarget.addEventListener('scroll', this.__onVirtualScrollEvt, listenOpts.passive)
    },

    __unconfigureScrollTarget () {
      if (this.__scrollTarget !== void 0) {
        this.__scrollTarget.removeEventListener('scroll', this.__onVirtualScrollEvt, listenOpts.passive)
        this.__scrollTarget = void 0
      }
    }
  },

  beforeMount () {
    this.__resetVirtualScroll()
  },

  mounted () {
    this.__configureScrollTarget()
  },

  beforeDestroy () {
    this.__unconfigureScrollTarget()
  },

  render (h) {
    if (this.$scopedSlots.default === void 0) {
      console.error(`QVirtualScroll: default scoped slot is required for rendering`, this)
      return
    }

    let child = this.__padVirtualScroll(
      h,
      this.type === 'list' ? 'div' : 'tbody',
      this.virtualScrollScope.map(this.$scopedSlots.default)
    )

    if (this.$scopedSlots.before !== void 0) {
      child = this.$scopedSlots.before().concat(child)
    }
    if (this.$scopedSlots.after !== void 0) {
      child = child.concat(this.$scopedSlots.after())
    }

    return this.type === '__qtable'
      ? getTableMiddle(h, { staticClass: this.classes }, child)
      : h(comps[this.type], {
        class: this.classes,
        attrs: this.attrs,
        props: this.$attrs,
        on: this.$listeners
      }, child)
  }
})
