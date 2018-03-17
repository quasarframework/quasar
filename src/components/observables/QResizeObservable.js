import { listenOpts } from '../../utils/event'

export default {
  name: 'QResizeObservable',
  props: {
    debounce: {
      type: Number,
      default: 100
    }
  },
  data () {
    return this.hasObserver
      ? {}
      : { url: this.$q.platform.is.ie ? null : 'about:blank' }
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
    if (this.hasObserver) {
      return
    }

    return h('object', {
      style: `display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;`,
      attrs: {
        type: 'text/html',
        data: this.url,
        'aria-hidden': true
      },
      on: {
        load: () => {
          this.loaded = true
          this.$el.contentDocument.defaultView.addEventListener('resize', this.trigger, listenOpts.passive)
          this.trigger()
        }
      }
    })
  },
  beforeCreate () {
    this.size = { width: -1, height: -1 }
    this.hasObserver = typeof ResizeObserver !== 'undefined'
  },
  mounted () {
    if (this.hasObserver) {
      this.observer = new ResizeObserver(this.trigger)
      this.observer.observe(this.$el.parentNode)
      return
    }

    this.trigger()

    if (this.$q.platform.is.ie) {
      this.url = 'about:blank'
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)

    if (this.hasObserver) {
      this.observer.unobserve(this.$el.parentNode)
      return
    }

    if (this.loaded) {
      this.$el.contentDocument.defaultView.removeEventListener('resize', this.trigger, listenOpts.passive)
    }
  }
}
