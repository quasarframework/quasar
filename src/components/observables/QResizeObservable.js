export default {
  name: 'q-resize-observable',
  methods: {
    onResize () {
      const size = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      if (!this.timer) {
        this.timer = setTimeout(this.emit, 32)
      }

      this.size = size
    },
    emit () {
      this.timer = null
      this.$emit('resize', this.size)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'absolute-full overflow-hidden invisible',
      style: 'z-index: -1;'
    })
  },
  mounted () {
    const
      object = document.createElement('object'),
      onIE = this.$q.platform.is.ie

    this.size = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }
    this.emit()

    this.object = object
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
    object.onload = () => {
      object.contentDocument.defaultView.addEventListener('resize', this.onResize)
    }
    object.type = 'text/html'
    if (onIE) {
      this.$el.appendChild(object)
    }
    object.data = 'about:blank'
    if (!onIE) {
      this.$el.appendChild(object)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (this.object && this.object.onload) {
      if (!this.$q.platform.is.ie && this.object.contentDocument) {
        this.object.contentDocument.defaultView.removeEventListener('resize', this.onResize)
      }
      delete this.object.onload
    }
  }
}
