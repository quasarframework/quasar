<template>
  <transition :name="transition">
    <div
      v-show="active"
      class="modal fullscreen flex"
      :class="positionClasses"
      @click="click()"
    >
      <div ref="content" class="modal-content" @click.stop :style="contentCss">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import Platform from '../../features/platform'
import EscapeKey from '../../features/escape-key'

let
  duration = 200, // in ms -- synch with transition CSS from Modal
  openedModalNumber = 0

export default {
  props: {
    transition: {
      type: String,
      default: 'q-modal'
    },
    positionClasses: {
      type: String,
      default: 'items-center justify-center'
    },
    contentCss: Object,
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    open (onShow) {
      if (this.active) {
        return
      }

      if (this.minimized && this.maximized) {
        throw new Error('Modal cannot be minimized & maximized simultaneous.')
      }

      document.body.classList.add('with-modal')
      EscapeKey.register(() => {
        if (this.noEscDismiss) {
          return
        }
        this.close(() => {
          this.$emit('escape-key')
        })
      })

      this.__popstate = () => {
        if (
          Platform.has.popstate &&
          window.history.state &&
          window.history.state.modalId &&
          window.history.state.modalId >= this.__modalId
        ) {
          return
        }
        openedModalNumber--
        EscapeKey.pop()
        this.active = false

        if (Platform.has.popstate) {
          window.removeEventListener('popstate', this.__popstate)
        }

        setTimeout(() => {
          if (!openedModalNumber) {
            document.body.classList.remove('with-modal')
          }
          if (typeof this.__onClose === 'function') {
            this.__onClose()
          }
          this.$emit('close')
        }, duration)
      }

      setTimeout(() => {
        this.$refs.content.scrollTop = 0
        ;[].slice.call(this.$refs.content.getElementsByClassName('modal-scroll')).forEach(el => {
          el.scrollTop = 0
        })
      }, 10)

      this.active = true
      this.__modalId = ++openedModalNumber
      if (Platform.has.popstate) {
        window.history.pushState({modalId: this.__modalId}, '')
        window.addEventListener('popstate', this.__popstate)
      }

      setTimeout(() => {
        if (typeof onShow === 'function') {
          onShow()
        }
        this.$emit('open')
      }, duration)
    },
    close (onClose) {
      this.__onClose = onClose

      if (!Platform.has.popstate) {
        this.__popstate()
      }
      else {
        window.history.go(-1)
      }
    },
    click (onClick) {
      if (this.noBackdropDismiss) {
        return
      }
      this.close(onClick)
    }
  }
}
</script>
