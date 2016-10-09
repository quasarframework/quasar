import Utils from '../../utils'

export default {
  bind () {
    this.scrollTarget = Utils.dom.getScrollTarget(this.el)
  },
  update (handler) {
    this.scrollTarget.removeEventListener('scroll', this.scroll)

    if (typeof handler !== 'function') {
      this.scroll = function () {}
      console.error('v-scroll-fire requires a function as parameter', this.el)
      return
    }

    this.scroll = Utils.debounce(() => {
      let containerBottom, elementBottom, fire

      if (this.scrollTarget === window) {
        elementBottom = this.el.getBoundingClientRect().bottom
        fire = elementBottom < Utils.dom.viewport().height
      }
      else {
        containerBottom = Utils.dom.offset(this.scrollTarget).top + Utils.dom.height(this.scrollTarget)
        elementBottom = Utils.dom.offset(this.el).top + Utils.dom.height(this.el)
        fire = elementBottom < containerBottom
      }

      if (fire) {
        this.scrollTarget.removeEventListener('scroll', this.scroll)
        handler(this.el)
      }
    }, 25)

    this.scrollTarget.addEventListener('scroll', this.scroll)
    this.scroll()
  },
  unbind () {
    this.scrollTarget.removeEventListener('scroll', this.scroll)
  }
}
