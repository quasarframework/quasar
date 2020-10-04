import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
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
        const height = this.layout.container === true
          ? this.layout.containerHeight
          : this.$q.screen.height

        return this.styleFn(offset, height)
      }

      return {
        minHeight: this.layout.container === true
          ? (this.layout.containerHeight - offset) + 'px'
          : (
            this.$q.screen.height === 0
              ? `calc(100vh - ${offset}px)`
              : (this.$q.screen.height - offset) + 'px'
          )
      }
    },

    classes () {
      return 'q-page' +
        (this.padding === true ? ' q-layout-padding' : '')
    }
  },

  render () {
    return h('main', {
      class: this.classes,
      style: this.style
    }, hSlot(this, 'default'))
  }
})
