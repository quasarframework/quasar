import Vue from 'vue'

export default Vue.extend({
  name: 'QPageContainer',

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

      if (this.layout.header.space) {
        css.paddingTop = `${this.layout.header.size}px`
      }
      if (this.layout.right.space) {
        css[`padding${this.$q.lang.rtl ? 'Left' : 'Right'}`] = `${this.layout.right.size}px`
      }
      if (this.layout.footer.space) {
        css.paddingBottom = `${this.layout.footer.size}px`
      }
      if (this.layout.left.space) {
        css[`padding${this.$q.lang.rtl ? 'Right' : 'Left'}`] = `${this.layout.left.size}px`
      }

      return css
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-page-container q-layout__section--animate',
      style: this.style
    }, this.$slots.default)
  }
})
