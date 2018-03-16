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
      if (!this.$el || !this.$el.parentNode) {
        return
      }

      const
        parent = this.$el.parentNode,
        size = {
          width: parent.offsetWidth,
          height: parent.offsetHeight
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
    return h('object', {
      style: this.style,
      attrs: {
        type: 'text/html',
        data: this.url,
        'aria-hidden': true
      },
      on: {
        load: () => {
          this.$el.contentDocument.defaultView.addEventListener('resize', this.trigger, listenOpts.passive)
          this.trigger()
        }
      }
    })
  },
  beforeCreate () {
    const ie = this.$q.platform.is.ie
    this.style = `display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;${ie ? 'visibility:hidden;' : ''}`
    this.url = ie ? null : 'about:blank'
    this.size = { width: -1, height: -1 }
  },
  mounted () {
    this.trigger()

    if (this.$q.platform.is.ie) {
      this.$el.data = 'about:blank'
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (!this.$q.platform.is.ie && this.$el.contentDocument) {
      this.$el.contentDocument.defaultView.removeEventListener('resize', this.trigger, listenOpts.passive)
    }
  }
}
