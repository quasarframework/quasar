import { debounce } from '../../utils/debounce'
import { listenOpts } from '../../utils/event'

export default {
  name: 'q-resize-observable',
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

    this.parent = this.$el.parentNode
    this.size = { width: -1, height: -1 }
    this.onResize = debounce(this.onResize, 100)
    this.onResize()

    this.object = object
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
    object.onload = () => {
      object.contentDocument.defaultView.addEventListener('resize', this.onResize, listenOpts.passive)
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
    if (this.object && this.object.onload) {
      if (!this.$q.platform.is.ie && this.object.contentDocument) {
        this.object.contentDocument.defaultView.removeEventListener('resize', this.onResize, listenOpts.passive)
      }
      delete this.object.onload
    }
  }
}
