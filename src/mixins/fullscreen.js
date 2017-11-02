import History from './history'

export default {
  data () {
    return {
      inFullscreen: false
    }
  },
  created () {
    this.fillerNode = document.createElement('span')
  },
  methods: {
    toggleFullscreen () {
      if (this.inFullscreen) {
        History.remove()
        return
      }

      this.__setFullscreen(true)
      History.add(() => new Promise((resolve, reject) => {
        this.__setFullscreen(false)
        resolve()
      }))
    },
    __setFullscreen (state) {
      if (this.inFullscreen === state) {
        return
      }

      if (state) {
        this.container = this.$el.parentNode
        this.container.replaceChild(this.fillerNode, this.$el)
        document.body.appendChild(this.$el)
        document.body.classList.add('with-mixin-fullscreen')
        this.inFullscreen = true
        return
      }

      this.inFullscreen = false
      this.container.replaceChild(this.$el, this.fillerNode)
      document.body.classList.remove('with-mixin-fullscreen')
    }
  }
}
