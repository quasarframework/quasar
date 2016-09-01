import Utils from '../utils'

export default {
  bind () {
    this.scrollTarget = Utils.dom.getScrollTarget(this.el)
    this.scroll = () => {
      this.handler(Utils.dom.getScrollPosition(this.scrollTarget))
    }
  },
  update (handler) {
    this.scrollTarget.removeEventListener('scroll', this.scroll)

    if (typeof handler !== 'function') {
      console.error('v-scroll requires a function as parameter', this.el)
      return
    }

    this.handler = handler
    this.scrollTarget.addEventListener('scroll', this.scroll)
  },
  unbind () {
    this.scrollTarget.removeEventListener('scroll', this.scroll)
  }
}
