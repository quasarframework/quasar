export default {
  name: 'QJumbotron',
  props: {
    color: String,
    textColor: String,
    dark: Boolean,
    tag: {
      type: String,
      default: 'div'
    },
    imgSrc: String,
    gradient: String
  },
  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        [`text-${this.textColor}`]: this.textColor,
        'q-jumbotron--dark': this.dark
      }
    },
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
    return h(this.tag, {
      staticClass: 'q-jumbotron',
      style: this.computedStyle,
      'class': this.classes
    }, this.$slots.default)
  }
}
