import Platform from '../features/platform'

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
        if (!Platform.has.popstate) {
          this.__setFullscreen(false)
        }
        else {
          window.history.go(-1)
        }
        return
      }

      this.__setFullscreen(true)
      if (Platform.has.popstate) {
        window.history.pushState({}, '')
        window.addEventListener('popstate', this.__popState)
      }
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
    },
    __popState () {
      if (this.inFullscreen) {
        this.__setFullscreen(false)
      }
      window.removeEventListener('popstate', this.__popState)
    }
  }
}
