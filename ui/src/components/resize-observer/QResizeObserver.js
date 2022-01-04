import Vue from 'vue'

import { listenOpts } from '../../utils/event.js'
import CanRenderMixin from '../../mixins/can-render.js'
import { isSSR } from '../../plugins/Platform.js'
import cache from '../../utils/cache.js'

export default Vue.extend({
  name: 'QResizeObserver',

  mixins: [ CanRenderMixin ],

  props: {
    debounce: {
      type: [ String, Number ],
      default: 100
    }
  },

  data () {
    return this.hasObserver === true
      ? {}
      : { url: this.$q.platform.is.ie === true ? null : 'about:blank' }
  },

  methods: {
    trigger (immediately) {
      if (immediately === true || this.debounce === 0 || this.debounce === '0') {
        this.__emit()
      }
      else if (this.timer === null) {
        this.timer = setTimeout(this.__emit, this.debounce)
      }
    },

    __emit () {
      if (this.timer !== null) {
        clearTimeout(this.timer)
        this.timer = null
      }

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
      this.$emit('resize', this.size)
    },

    __cleanup () {
      if (this.curDocView !== void 0) {
        // iOS is fuzzy, need to check it first
        if (this.curDocView.removeEventListener !== void 0) {
          this.curDocView.removeEventListener('resize', this.trigger, listenOpts.passive)
        }
        this.curDocView = void 0
      }
    },

    __onObjLoad () {
      this.__cleanup()

      if (this.$el.contentDocument) {
        this.curDocView = this.$el.contentDocument.defaultView
        this.curDocView.addEventListener('resize', this.trigger, listenOpts.passive)
      }

      this.__emit()
    }
  },

  render (h) {
    if (this.canRender === false || this.hasObserver === true) {
      return
    }

    return h('object', {
      style: this.style,
      attrs: {
        tabindex: -1, // fix for Firefox
        type: 'text/html',
        data: this.url,
        'aria-hidden': 'true'
      },
      on: cache(this, 'load', {
        load: this.__onObjLoad
      })
    })
  },

  beforeCreate () {
    this.size = { width: -1, height: -1 }
    if (isSSR === true) { return }

    this.hasObserver = typeof ResizeObserver !== 'undefined'

    if (this.hasObserver !== true) {
      this.style = `${this.$q.platform.is.ie ? 'visibility:hidden;' : ''}display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;`
    }
  },

  mounted () {
    this.timer = null

    if (this.hasObserver === true) {
      this.observer = new ResizeObserver(this.trigger)
      this.observer.observe(this.$el.parentNode)
      this.__emit()
      return
    }

    if (this.$q.platform.is.ie === true) {
      this.url = 'about:blank'
      this.__emit()
    }
    else {
      this.__onObjLoad()
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)

    if (this.hasObserver === true) {
      if (this.observer !== void 0 && this.$el.parentNode) {
        this.observer.unobserve(this.$el.parentNode)
      }
      return
    }

    this.__cleanup()
  }
})
