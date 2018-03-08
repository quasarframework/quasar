import { listenOpts } from '../../utils/event'

export default {
  name: 'QResizeObservable',
  props: {
    debounce: {
      type: Number,
      default: 100
    }
  },
  methods: {
    onResize () {
      const size = {
        width: this.parent.offsetWidth,
        height: this.parent.offsetHeight
      }

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      this.size = size
      this.timer = null
      this.$emit('resize', this.size)
    },
    trigger () {
      if (this.debounce === 0) {
        this.onResize()
      }
      else if (!this.timer) {
        this.timer = setTimeout(this.onResize, this.debounce)
      }
    }
  },
  render (h) {
    return h('span')
  },
  mounted () {
    const
      object = document.createElement('object'),
      onIE = this.$q.platform.is.ie

    this.parent = this.$el.parentNode
    this.size = { width: -1, height: -1 }
    this.trigger()

    this.object = object
    object.setAttribute('aria-hidden', true)
    object.setAttribute('style', 'display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;visibility:hidden;')
    object.onload = () => {
      object.contentDocument.defaultView.addEventListener('resize', this.trigger, listenOpts.passive)
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
        this.object.contentDocument.defaultView.removeEventListener('resize', this.trigger, listenOpts.passive)
      }
      delete this.object.onload
    }
  }
}
