import { h, defineComponent } from 'vue'

import QList from '../item/QList.js'
import QMarkupTable from '../markup-table/QMarkupTable.js'
import getTableMiddle from '../table/get-table-middle.js'

import VirtualScroll from '../../mixins/virtual-scroll.js'

import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import { mergeSlot } from '../../utils/slot.js'

const comps = {
  list: QList,
  table: QMarkupTable
}

const typeOptions = [ 'list', 'table', '__qtable' ]

export default defineComponent({
  name: 'QVirtualScroll',

  mixins: [ VirtualScroll ],

  props: {
    type: {
      type: String,
      default: 'list',
      validator: v => typeOptions.includes(v)
    },

    items: {
      type: Array,
      default: () => []
    },

    itemsFn: Function,
    itemsSize: Number,

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

      return this.itemsFn === void 0
        ? this.items.slice(this.virtualScrollSliceRange.from, this.virtualScrollSliceRange.to).map(mapFn)
        : this.itemsFn(this.virtualScrollSliceRange.from, this.virtualScrollSliceRange.to - this.virtualScrollSliceRange.from).map(mapFn)
    },

    classes () {
      return 'q-virtual-scroll q-virtual-scroll' + (this.virtualScrollHorizontal === true ? '--horizontal' : '--vertical') +
        (this.scrollTarget !== void 0 ? '' : ' scroll')
    },

    attrs () {
      return this.scrollTarget !== void 0 ? {} : { tabindex: 0 }
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
      this.__scrollTarget = getScrollTarget(this.$el, this.scrollTarget)
      this.__scrollTarget.addEventListener('scroll', this.__onVirtualScrollEvt, listenOpts.passive)
    },

    __unconfigureScrollTarget () {
      if (this.__scrollTarget !== void 0) {
        this.__scrollTarget.removeEventListener('scroll', this.__onVirtualScrollEvt, listenOpts.passive)
        this.__scrollTarget = void 0
      }
    },

    __getVirtualChildren () {
      let child = this.__padVirtualScroll(
        this.type === 'list' ? 'div' : 'tbody',
        this.virtualScrollScope.map(this.$slots.default)
      )

      if (this.$slots.before !== void 0) {
        child = this.$slots.before().concat(child)
      }

      return mergeSlot(child, this, 'after')
    }
  },

  render () {
    if (this.$slots.default === void 0) {
      console.error(`QVirtualScroll: default scoped slot is required for rendering`, this)
      return
    }

    return this.type === '__qtable'
      ? getTableMiddle(
        { class: 'q-table__middle ' + this.classes },
        this.__getVirtualChildren()
      )
      : h(comps[this.type], {
        class: this.classes,
        ...this.$attrs,
        ...this.attrs
      }, this.__getVirtualChildren)
  },

  beforeMount () {
    this.__resetVirtualScroll()
  },

  mounted () {
    this.__configureScrollTarget()
  },

  beforeUnmount () {
    this.__unconfigureScrollTarget()
  }
})
