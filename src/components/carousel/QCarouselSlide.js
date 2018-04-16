export default {
  name: 'QCarouselSlide',
  inject: {
    carousel: {
      default () {
        console.error('QCarouselSlide needs to be child of QCarousel')
      }
    }
  },
  props: {
    imgSrc: String
  },
  computed: {
    computedStyle () {
      const style = {}
      if (this.imgSrc) {
        style.backgroundImage = `url(${this.imgSrc})`
        style.backgroundSize = `cover`
        style.backgroundPosition = `50%`
      }
      if (!this.carousel.inFullscreen && this.carousel.height) {
        style.maxHeight = this.carousel.height
      }
      return style
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-carousel-slide relative-position scroll',
      style: this.computedStyle
    }, this.$slots.default)
  },
  created () {
    this.carousel.__registerSlide()
  },
  beforeDestroy () {
    this.carousel.__unregisterSlide()
  }
}
