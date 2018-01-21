import History from '../plugins/history'

export default {
  data () {
    return {
      inFullscreen: false
    }
  },
  watch: {
    $route () {
      this.exitFullscreen()
    }
  },
  methods: {
    toggleFullscreen () {
      if (this.inFullscreen) {
        this.exitFullscreen()
      }
      else {
        this.setFullscreen()
      }
    },
    setFullscreen () {
      if (this.inFullscreen) {
        return
      }

      this.inFullscreen = true
      this.container = this.$el.parentNode
      this.container.replaceChild(this.fullscreenFillerNode, this.$el)
      document.body.appendChild(this.$el)
      document.body.classList.add('with-mixin-fullscreen')

      this.__historyFullscreen = {
        handler: this.exitFullscreen
      }
      History.add(this.__historyFullscreen)
    },
    exitFullscreen () {
      if (!this.inFullscreen) {
        return
      }

      if (this.__historyFullscreen) {
        History.remove(this.__historyFullscreen)
        this.__historyFullscreen = null
      }
      this.container.replaceChild(this.$el, this.fullscreenFillerNode)
      document.body.classList.remove('with-mixin-fullscreen')
      this.inFullscreen = false
    }
  },
  created () {
    this.fullscreenFillerNode = document.createElement('span')
  },
  beforeDestroy () {
    this.exitFullscreen()
  }
}
