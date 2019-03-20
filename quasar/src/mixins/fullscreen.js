import History from '../history.js'

export default {
  props: {
    fullscreen: Boolean
  },

  data () {
    return {
      inFullscreen: false
    }
  },

  watch: {
    $route () {
      this.exitFullscreen()
    },

    fullscreen (v) {
      if (this.inFullscreen !== v) {
        this.toggleFullscreen()
      }
    },

    inFullscreen (v) {
      this.$emit('update:fullscreen', v)
      this.$emit('fullscreen', v)
    }
  },

  methods: {
    toggleFullscreen () {
      if (this.inFullscreen === true) {
        this.exitFullscreen()
      }
      else {
        this.setFullscreen()
      }
    },

    setFullscreen () {
      if (this.inFullscreen === true) {
        return
      }

      this.inFullscreen = true
      this.container = this.$el.parentNode
      this.container.replaceChild(this.fullscreenFillerNode, this.$el)
      document.body.appendChild(this.$el)
      document.body.classList.add('q-body--fullscreen-mixin')

      this.__historyFullscreen = {
        handler: this.exitFullscreen
      }
      History.add(this.__historyFullscreen)
    },

    exitFullscreen () {
      if (this.inFullscreen !== true) {
        return
      }

      if (this.__historyFullscreen !== void 0) {
        History.remove(this.__historyFullscreen)
        this.__historyFullscreen = void 0
      }
      this.container.replaceChild(this.$el, this.fullscreenFillerNode)
      document.body.classList.remove('q-body--fullscreen-mixin')
      this.inFullscreen = false
    }
  },

  beforeMount () {
    this.fullscreenFillerNode = document.createElement('span')
  },

  mounted () {
    this.fullscreen === true && this.setFullscreen()
  },

  beforeDestroy () {
    this.exitFullscreen()
  }
}
