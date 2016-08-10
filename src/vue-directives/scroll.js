export default {
  bind () {
    this.scrollContainer = this.el.closest('.layout-scroll-area')
    if (!this.scrollContainer) {
      this.scrollContainer = document.getElementById('quasar-app')
    }
  },
  update (handler) {
    if (this.scroll) {
      this.scrollContainer.removeEventListener('scroll', this.scroll)
    }

    if (typeof handler !== 'function') {
      console.error('v-scroll requires a function as parameter', this.el)
      return
    }

    this.scroll = () => {
      handler(this.scrollContainer.scrollTop)
    }
    this.scrollContainer.addEventListener('scroll', this.scroll)
  },
  unbind () {
    this.scrollContainer.removeEventListener('scroll', this.scroll)
  }
}
