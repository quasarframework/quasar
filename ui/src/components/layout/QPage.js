import Vue from 'vue'

import slot from '../../utils/slot.js'

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
        (this.layout.header.space === true ? this.layout.header.size : 0) +
        (this.layout.footer.space === true ? this.layout.footer.size : 0)

      if (typeof this.styleFn === 'function') {
        return this.styleFn(offset)
      }

      const height = this.layout.container === true
        ? this.layout.containerHeight
        : this.$q.screen.height

      return { minHeight: (height - offset) + 'px' }
    },

    classes () {
      if (this.padding === true) {
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
