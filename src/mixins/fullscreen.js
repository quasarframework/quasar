import History from './history'

export default {
  data () {
    return {
      inFullscreen: false
    }
  },
  methods: {
    toggleFullscreen () {
      this.__setFullscreen(!this.inFullscreen)
    },
    __setFullscreen (val) {
      if (this.inFullscreen === val) {
        return
      }
      if (!val) {
        History.remove()
        return
      }

      setTimeout(() => {
        this.inFullscreen = true
        this.container = this.$el.parentNode
        this.container.replaceChild(this.fullscreenFillerNode, this.$el)
        document.body.appendChild(this.$el)
        document.body.classList.add('with-mixin-fullscreen')

        History.add(() => new Promise((resolve, reject) => {
          this.container.replaceChild(this.$el, this.fullscreenFillerNode)
          document.body.classList.remove('with-mixin-fullscreen')
          this.inFullscreen = false
          resolve()
        }))
      }, 50)
    }
  },
  created () {
    this.fullscreenFillerNode = document.createElement('span')
  }
}
