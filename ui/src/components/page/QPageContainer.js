import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPageContainer',

  mixins: [ ListenersMixin ],

  inject: {
    layout: {
      default () {
        console.error('QPageContainer needs to be child of QLayout')
      }
    }
  },

  provide: {
    pageContainer: true
  },

  computed: {
    style () {
      const css = {}

      if (this.layout.header.space === true) {
        css.paddingTop = `${this.layout.header.size}px`
      }
      if (this.layout.right.space === true) {
        css[`padding${this.$q.lang.rtl === true ? 'Left' : 'Right'}`] = `${this.layout.right.size}px`
      }
      if (this.layout.footer.space === true) {
        css.paddingBottom = `${this.layout.footer.size}px`
      }
      if (this.layout.left.space === true) {
        css[`padding${this.$q.lang.rtl === true ? 'Right' : 'Left'}`] = `${this.layout.left.size}px`
      }

      return css
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-page-container',
      style: this.style,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
