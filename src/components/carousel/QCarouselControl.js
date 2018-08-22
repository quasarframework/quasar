export default {
  name: 'QCarouselControl',
  props: {
    position: {
      type: String,
      default: 'bottom-right'
    },
    offset: {
      type: Array,
      default: () => [18, 18]
    }
  },
  computed: {
    computedClass () {
      return `absolute-${this.position}`
    },
    computedStyle () {
      return {
        margin: `${this.offset[1]}px ${this.offset[0]}px`
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-carousel-control absolute',
      style: this.computedStyle,
      'class': this.computedClass
    }, this.$slots.default)
  }
}
