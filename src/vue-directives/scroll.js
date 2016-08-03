import $ from 'jquery'

export default {
  bind () {
    this.element = $(this.el)
    this.scrollContainer = this.element.parents('.layout-scroll-area')
    if (this.scrollContainer.length === 0) {
      this.scrollContainer = $('#quasar-app')
    }
  },
  update (handler) {
    if (this.scroll) {
      this.scrollContainer.off('scroll', this.scroll)
    }

    if (typeof handler !== 'function') {
      console.error('v-scroll requires a function as parameter', this.el)
      return
    }

    this.scroll = () => {
      handler(this.scrollContainer.scrollTop())
    }
    this.scrollContainer.scroll(this.scroll)
  },
  unbind () {
    this.scrollContainer.off('scroll', this.scroll)
  }
}
