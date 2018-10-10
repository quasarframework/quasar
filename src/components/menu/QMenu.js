import Vue from 'vue'

import ModelToggleMixin from '../../mixins/model-toggle.js'
import CanRenderMixin from '../../mixins/can-render.js'
import ClickOutside from '../../directives/click-outside.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import EscapeKey from '../../utils/escape-key.js'

import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default Vue.extend({
  name: 'QMenu',

  mixins: [ ModelToggleMixin, CanRenderMixin ],

  directives: {
    ClickOutside
  },

  props: {
    transitionShow: {
      type: String,
      default: 'fade'
    },
    transitionHide: {
      type: String,
      default: 'fade'
    },

    fit: Boolean,
    cover: Boolean,
    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },

    persistent: Boolean,
    disable: Boolean
  },

  data () {
    return {
      transitionState: this.showing
    }
  },

  computed: {
    transition () {
      return 'q-transition--' + (this.transitionState === true ? this.transitionHide : this.transitionShow)
    },

    horizSide () {
      return this.$q.i18n.rtl ? 'right' : 'left'
    },

    anchorOrigin () {
      return parsePosition(
        this.anchor || (
          this.cover === true ? `top ${this.horizSide}` : `bottom ${this.horizSide}`
        )
      )
    },

    selfOrigin () {
      return this.cover === true
        ? this.anchorOrigin
        : parsePosition(this.self || `top ${this.horizSide}`)
    }
  },

  watch: {
    showing (val) {
      this.transitionShow !== this.transitionHide && this.$nextTick(() => {
        this.transitionState = val
      })
    }
  },

  methods: {
    __show (evt) {
      clearTimeout(this.timer)

      this.scrollTarget = getScrollTarget(this.anchorEl)
      this.scrollTarget.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      if (this.scrollTarget !== window) {
        window.addEventListener('scroll', this.updatePosition, listenOpts.passive)
      }

      EscapeKey.register(() => {
        this.$emit('escape-key')
        this.hide()
      })

      document.body.appendChild(this.$el)
      this.$nextTick(() => {
        this.updatePosition(evt)
        if (this.unwatch === void 0) {
          this.unwatch = this.$watch('$q.screen.width', this.updatePosition)
        }
      })
      this.timer = setTimeout(() => {
        this.$emit('show', evt)
      }, 600)
    },

    __hide (evt) {
      this.__cleanup()

      this.timer = setTimeout(() => {
        this.$el.remove()
        this.$emit('hide', evt)
      }, 600)
    },

    __cleanup () {
      clearTimeout(this.timer)

      EscapeKey.pop()

      if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }

      if (this.scrollTarget) {
        this.scrollTarget.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        if (this.scrollTarget !== window) {
          window.removeEventListener('scroll', this.updatePosition, listenOpts.passive)
        }
      }
    },

    __toggleKey (evt) {
      if (evt.keyCode === 13) {
        this.toggle(evt)
      }
    },

    updatePosition (evt) {
      if (this.fit || this.cover) {
        const { width, height } = this.anchorEl.getBoundingClientRect()
        this.$el.style.minWidth = width + 'px'
        if (this.cover) {
          this.$el.style.minHeight = height + 'px'
        }
      }

      setPosition({
        // evt,
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        fit: this.fit,
        cover: this.cover
      })
    }
  },

  render (h) {
    if (this.canRender === false || this.disable === true) { return }

    return h('transition', {
      props: { name: this.transition }
    }, [
      this.showing ? h('div', {
        staticClass: 'q-menu scroll',
        directives: this.persistent !== true ? [{
          name: 'click-outside',
          value: this.hide,
          arg: [ this.anchorEl ]
        }] : null
      }, this.$slots.default) : null
    ])
  },

  mounted () {
    this.anchorEl = this.$el.parentNode
    this.anchorEl.removeChild(this.$el)

    while (this.anchorEl.classList.contains('q-menu--skip')) {
      this.anchorEl = this.anchorEl.parentNode
    }

    this.anchorEl.classList.add('cursor-pointer')
    this.anchorEl.addEventListener('click', this.toggle)
    this.anchorEl.addEventListener('keyup', this.__toggleKey)

    this.value && this.show()
  },

  beforeDestroy () {
    this.__cleanup()

    this.$el.remove()
    this.anchorEl.removeEventListener('click', this.toggle)
    this.anchorEl.removeEventListener('keyup', this.__toggleKey)
  }
})
