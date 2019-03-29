import { clearSelection } from '../utils/selection.js'
import { prevent } from '../utils/event.js'

export default {
  props: {
    target: {
      type: [Boolean, String],
      default: true
    },
    contextMenu: Boolean
  },

  watch: {
    contextMenu (val) {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl(!val)
        this.__configureAnchorEl(val)
      }
    },

    target () {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl()
      }

      this.__pickAnchorEl()
    }
  },

  methods: {
    __showCondition (evt) {
      // abort with no parent configured or on multi-touch
      if (this.anchorEl === void 0) {
        return false
      }
      if (evt === void 0) {
        return true
      }
      return evt.defaultPrevented !== true && (evt.touches === void 0 || evt.touches.length <= 1)
    },

    __contextClick (evt) {
      if (evt === void 0 || evt.defaultPrevented !== true) {
        this.hide(evt)
        this.show(evt)
        prevent(evt)
      }
    },

    __toggleKey (evt) {
      if (evt !== void 0 && evt.keyCode === 13 && evt.defaultPrevented !== true) {
        this.toggle(evt)
      }
    },

    __mobileTouch (evt) {
      this.__mobileCleanup()
      if (this.__showCondition(evt) !== true) {
        return
      }
      this.hide(evt)
      this.anchorEl.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        this.show(evt)
      }, 300)
    },

    __mobileCleanup (evt) {
      this.anchorEl.classList.remove('non-selectable')
      clearTimeout(this.touchTimer)
      if (this.showing === true && evt !== void 0) {
        clearSelection()
        prevent(evt)
      }
    },

    __unconfigureAnchorEl (context = this.contextMenu) {
      if (context === true) {
        if (this.$q.platform.is.mobile) {
          this.anchorEl.removeEventListener('touchstart', this.__mobileTouch)
          ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
            this.anchorEl.removeEventListener(evt, this.__mobileCleanup)
          })
        }
        else {
          this.anchorEl.removeEventListener('click', this.hide)
          this.anchorEl.removeEventListener('contextmenu', this.__contextClick)
        }
      }
      else {
        this.anchorEl.removeEventListener('click', this.toggle)
        this.anchorEl.removeEventListener('keyup', this.__toggleKey)
      }
    },

    __configureAnchorEl (context = this.contextMenu) {
      if (this.noParentEvent === true) { return }

      if (context === true) {
        if (this.$q.platform.is.mobile) {
          this.anchorEl.addEventListener('touchstart', this.__mobileTouch)
          ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
            this.anchorEl.addEventListener(evt, this.__mobileCleanup)
          })
        }
        else {
          this.anchorEl.addEventListener('click', this.hide)
          this.anchorEl.addEventListener('contextmenu', this.__contextClick)
        }
      }
      else {
        this.anchorEl.addEventListener('click', this.toggle)
        this.anchorEl.addEventListener('keyup', this.__toggleKey)
      }
    },

    __setAnchorEl (el) {
      this.anchorEl = el
      while (this.anchorEl.classList.contains('q-anchor--skip')) {
        this.anchorEl = this.anchorEl.parentNode
      }
      this.__configureAnchorEl()
    },

    __pickAnchorEl () {
      if (this.target && typeof this.target === 'string') {
        const el = document.querySelector(this.target)
        if (el !== null) {
          this.anchorEl = el
          this.__configureAnchorEl()
        }
        else {
          this.anchorEl = void 0
          console.error(`Anchor: target "${this.target}" not found`, this)
        }
      }
      else if (this.target !== false) {
        this.__setAnchorEl(this.parentEl)
      }
      else {
        this.anchorEl = void 0
      }
    }
  },

  mounted () {
    this.parentEl = this.$el.parentNode

    this.$nextTick(() => {
      this.__pickAnchorEl()

      if (this.value === true) {
        if (this.anchorEl === void 0) {
          this.$emit('input', false)
        }
        else {
          this.show()
        }
      }
    })
  },

  beforeDestroy () {
    clearTimeout(this.touchTimer)
    this.__anchorCleanup !== void 0 && this.__anchorCleanup()

    if (this.anchorEl !== void 0) {
      this.__unconfigureAnchorEl()
    }
  }
}
