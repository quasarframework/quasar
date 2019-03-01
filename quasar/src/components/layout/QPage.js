import Vue from 'vue'

import slot from '../../utils/slot.js'
import Platform from '../../plugins/Platform'

export default Vue.extend({
  name: 'QPage',

  inject: {
    pageContainer: {
      default () {
        console.error('QPage needs to be child of QPageContainer')
      }
    },
    layout: {}
  },

  props: {
    padding: Boolean,
    styleFn: Function
  },

  computed: {
    style () {
      const offset =
        (this.layout.header.space ? this.layout.header.size : 0) +
        (this.layout.footer.space ? this.layout.footer.size : 0)

      if (typeof this.styleFn === 'function') {
        return this.styleFn(offset)
      }

      const calcHeight = Platform.is.ie
        ? (offset ? `calc(100vh - ${offset}px)` : `100vh`)
        : (offset ? `calc(var(--q-window-height) - ${offset}px)` : `var(--q-window-height)`)

      const height = this.layout.container
        ? (this.layout.containerHeight - offset) + 'px'
        : calcHeight

      return { height }
    },

    classes () {
      if (this.padding) {
        return 'q-layout-padding'
      }
    }
  },

  render (h) {
    return h('main', {
      staticClass: 'q-page',
      style: this.style,
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
