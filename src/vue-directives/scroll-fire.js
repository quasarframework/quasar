import Utils from '../utils'

export default {
  bind () {
    this.scrollContainer = this.el.closest('.layout-view')
    if (!this.scrollContainer) {
      this.scrollContainer = document.getElementById('quasar-app')
    }
  },
  update (handler) {
    if (this.scroll) {
      this.scrollContainer.removeEventListener('scroll', this.scroll)
    }

    if (typeof handler !== 'function') {
      this.scroll = function () {}
      console.error('v-scroll-fire requires a function as parameter', this.el)
      return
    }

    this.scroll = Utils.debounce(() => {
      let
        containerBottom = Utils.dom.offset(this.scrollContainer).top + Utils.dom.height(this.scrollContainer),
        elementBottom = Utils.dom.offset(this.el).top + Utils.dom.height(this.el)

      if (elementBottom < containerBottom) {
        this.scrollContainer.removeEventListener('scroll', this.scroll)
        handler(this.el)
      }
    }, 50)

    this.scrollContainer.addEventListener('scroll', this.scroll)
    this.scroll()
  },
  unbind () {
    this.scrollContainer.removeEventListener('scroll', this.scroll)
  }
}
