
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

    target (val) {
      if (this.anchorEl !== void 0) {
        this.__unconfigureAnchorEl()
      }

      this.__pickAnchorEl()
    }
  },

  methods: {
    __showCondition (evt) {
      // abort with no parent configured or on multi-touch
      return !(this.anchorEl === void 0 || (evt !== void 0 && evt.touches !== void 0 && evt.touches.length > 1))
    },

    __contextClick (evt) {
      this.hide(evt)
      this.show(evt)
    },

    __toggleKey (evt) {
      if (evt.keyCode === 13) {
        this.toggle(evt)
      }
    },

    __mobileTouch (evt) {
      this.__mobileCleanup()
      if (evt && evt.touches && evt.touches.length > 1) {
        return
      }
      this.hide(evt)
      this.anchorEl.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        this.__mobileCleanup()
        this.touchTimer = setTimeout(() => {
          this.show(evt)
        }, 10)
      }, 600)
    },

    __mobileCleanup () {
      this.anchorEl.classList.remove('non-selectable')
      clearTimeout(this.touchTimer)
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
          this.__setAnchorEl(el)
        }
        else {
          console.error(`Anchor: target "${this.target}" not found`, this)
        }
      }
      else if (this.target !== false) {
        this.__setAnchorEl(this.parentEl)
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
    this.__cleanup !== void 0 && this.__cleanup()

    if (this.anchorEl !== void 0) {
      this.__unconfigureAnchorEl()
    }
  }
}
