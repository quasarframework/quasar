import { stopAndPrevent } from '../../utils/event.js'
import QModal from '../modal/QModal.js'
import QPopover from '../popover/QPopover.js'

export default {
  name: 'QContextMenu',
  props: {
    disable: Boolean
  },
  data () {
    return {
      mobile: this.$q.platform.is.mobile
    }
  },
  methods: {
    hide (evt) {
      if (this.$refs.popup) {
        this.mobile && this.target.classList.remove('non-selectable')
        return this.$refs.popup.hide(evt)
      }
    },
    show (evt) {
      if (this.disable) {
        return
      }

      if (this.mobile) {
        if (this.$refs.popup) {
          this.event = evt
          this.$refs.popup.show(evt)
        }
        return
      }

      if (!evt) {
        return
      }

      stopAndPrevent(evt)
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        if (this.$refs.popup) {
          this.event = evt
          this.$refs.popup.show(evt)
        }
      }, 100)
    },

    __desktopBodyHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.hide(evt)
      }
    },
    __desktopOnShow () {
      document.body.addEventListener('contextmenu', this.__desktopBodyHide, true)
      document.body.addEventListener('click', this.__desktopBodyHide, true)
      this.$emit('show', this.event)
    },
    __desktopOnHide (evt) {
      document.body.removeEventListener('contextmenu', this.__desktopBodyHide, true)
      document.body.removeEventListener('click', this.__desktopBodyHide, true)
      this.$emit('hide', this.event, evt)
    },

    __mobileTouchStartHandler (evt) {
      this.__mobileCleanup()
      if (evt && evt.touches && evt.touches.length > 1) {
        return
      }
      this.target.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        evt && stopAndPrevent(evt)
        this.__mobileCleanup()
        setTimeout(() => {
          this.show(evt)
        }, 10)
      }, 600)
    },
    __mobileCleanup () {
      this.target.classList.remove('non-selectable')
      clearTimeout(this.touchTimer)
    }
  },
  render (h) {
    if (this.mobile) {
      return h(QModal, {
        ref: 'popup',
        props: {
          minimized: true
        },
        on: {
          show: () => { this.$emit('show', this.event) },
          hide: evt => { this.$emit('hide', this.event, evt) }
        }
      }, this.$slots.default)
    }

    return h(QPopover, {
      ref: 'popup',
      props: {
        anchorClick: false
      },
      on: {
        show: this.__desktopOnShow,
        hide: this.__desktopOnHide
      }
    }, this.$slots.default)
  },
  mounted () {
    if (this.mobile) {
      this.$nextTick(() => {
        this.target = this.$el.parentNode
        this.target.addEventListener('touchstart', this.__mobileTouchStartHandler)
        ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
          this.target.addEventListener(evt, this.__mobileCleanup)
        })
      })
    }
    else {
      this.target = this.$el.parentNode
      this.target.addEventListener('contextmenu', this.show)
    }
  },
  beforeDestroy () {
    if (this.mobile) {
      this.target.removeEventListener('touchstart', this.__mobileTouchStartHandler)
      ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
        this.target.removeEventListener(evt, this.__mobileCleanup)
      })
    }
    else {
      this.target.removeEventListener('contextmenu', this.show)
    }
  }
}
