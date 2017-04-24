<template>
  <q-transition :name="modalTransition" :enter="enterClass" :leave="leaveClass">
    <div
      v-show="active"
      class="modal fullscreen flex"
      :class="modalClasses"
      @click="click()"
    >
      <div
        ref="content"
        class="modal-content scroll"
        @click.stop
        :style="modalCss"
        :class="contentClasses"
      >
        <slot></slot>
      </div>
    </div>
  </q-transition>
</template>

<script>
import Platform from '../../features/platform'
import EscapeKey from '../../features/escape-key'
import extend from '../../utils/extend'
import { QTransition } from '../transition'

const positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
}
const positionCSS = {
  mat: {
    maxHeight: '80vh',
    height: 'auto'
  },
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none'
  }
}

function additionalCSS (theme, position) {
  let css = {}

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw'
  }
  if (theme === 'ios') {
    if (['left', 'top'].includes(position)) {
      css.borderTopLeftRadius = 0
    }
    if (['right', 'top'].includes(position)) {
      css.borderTopRightRadius = 0
    }
    if (['left', 'bottom'].includes(position)) {
      css.borderBottomLeftRadius = 0
    }
    if (['right', 'bottom'].includes(position)) {
      css.borderBottomRightRadius = 0
    }
  }

  return css
}

let
  duration = 200, // in ms -- synch with transition CSS from Modal
  openedModalNumber = 0

export default {
  name: 'q-modal',
  components: {
    QTransition
  },
  props: {
    position: {
      type: String,
      default: '',
      validator (val) {
        return val === '' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    transition: {
      type: String,
      default: 'q-modal'
    },
    enterClass: String,
    leaveClass: String,
    positionClasses: {
      type: String,
      default: 'items-center justify-center'
    },
    contentClasses: [Object, String],
    contentCss: [Object, String],
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
  computed: {
    modalClasses () {
      return this.position
        ? positions[this.position]
        : this.positionClasses
    },
    modalTransition () {
      return this.position ? `q-modal-${this.position}` : this.transition
    },
    modalCss () {
      if (this.position) {
        return extend(
          {},
          positionCSS[this.$q.theme],
          additionalCSS(this.$q.theme, this.position),
          this.contentCss
        )
      }
      return this.contentCss
    }
  },
  methods: {
    open (onShow) {
      if (this.minimized && this.maximized) {
        throw new Error('Modal cannot be minimized & maximized simultaneously.')
      }
      if (this.active) {
        return
      }

      document.body.appendChild(this.$el)
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
        let content = this.$refs.content
        content.scrollTop = 0
        ;['modal-scroll', 'layout-view'].forEach(c => {
          [].slice.call(content.getElementsByClassName(c)).forEach(el => {
            el.scrollTop = 0
          })
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
      if (!this.active) {
        return
      }

      this.__onClose = onClose

      if (!Platform.has.popstate) {
        this.__popstate()
      }
      else {
        window.history.go(-1)
      }
    },
    toggle (done) {
      if (this.active) {
        this.close(done)
      }
      else {
        this.open(done)
      }
    },
    click (onClick) {
      if (this.noBackdropDismiss) {
        return
      }
      this.close(onClick)
    }
  },
  beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
