import $ from 'jquery'
import debounce from '../utils/debounce'

export default {
  bind () {
    this.element = $(this.el)
    this.scrollContainer = this.element.parents('.layout-content')
    if (this.scrollContainer.length === 0) {
      this.scrollContainer = $('#quasar-app')
    }
  },
  update (handler) {
    if (this.scroll) {
      this.scrollContainer.off('scroll', this.scroll)
    }

    if (typeof handler !== 'function') {
      this.scroll = $.noop
      console.error('v-scroll-fire requires a function as parameter', this.el)
      return
    }

    this.scroll = debounce(() => {
      var
        containerBottom = this.scrollContainer.offset().top + this.scrollContainer.innerHeight(),
        elementBottom = this.element.offset().top + this.element.height()

      if (elementBottom < containerBottom) {
        this.scrollContainer.off('scroll', this.scroll)
        handler(this.element)
      }
    }, 50)

    this.scrollContainer.scroll(this.scroll)
    this.scroll()
  },
  unbind () {
    this.scrollContainer.off('scroll', this.scroll)
  }
}
