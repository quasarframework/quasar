import History from './history'

export default {
  props: {
    fullscreen: Boolean
  },
  watch: {
    fullscreen (val) {
      if (val) {
        this.__goFullscreen()
      }
      else {
        History.remove()
      }
    }
  },
  methods: {
    __goFullscreen () {
      setTimeout(() => {
        this.container = this.$el.parentNode
        this.container.replaceChild(this.fullscreenFillerNode, this.$el)
        document.body.appendChild(this.$el)
        document.body.classList.add('with-mixin-fullscreen')

        History.add(() => new Promise((resolve, reject) => {
          this.container.replaceChild(this.$el, this.fullscreenFillerNode)
          document.body.classList.remove('with-mixin-fullscreen')
          if (this.fullscreen !== false) {
            this.$emit('update:fullscreen', false)
          }
          resolve()
        }))
      }, 50)
    }
  },
  created () {
    this.fullscreenFillerNode = document.createElement('span')
    if (this.fullscreen) {
      this.__goFullscreen()
    }
  }
}
