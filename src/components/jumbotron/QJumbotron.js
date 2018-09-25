import Vue from 'vue'
export default Vue.extend({
  name: 'QJumbotron',

  props: {
    imgSrc: String,
    gradient: String
  },

  computed: {
    gradientType () {
      if (this.gradient) {
        return this.gradient.indexOf('circle') > -1
          ? 'radial'
          : 'linear'
      }
    },

    computedStyle () {
      if (this.imgSrc) {
        return {
          'background-image': `url(${this.imgSrc})`
        }
      }
      if (this.gradientType) {
        return {
          background: `${this.gradientType}-gradient(${this.gradient})`
        }
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-jumbotron',
      style: this.computedStyle
    }, this.$slots.default)
  }
})
