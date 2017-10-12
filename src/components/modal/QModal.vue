<template>
  <q-transition :name="modalTransition" :enter="enterClass" :leave="leaveClass">
    <div
      v-show="active"
      class="modal fullscreen row"
      :class="modalClasses"
      @mousedown="__dismiss()"
      @touchstart="__dismiss()"
    >
      <div
        ref="content"
        class="modal-content scroll"
        @mousedown.stop
        @touchstart.stop
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
import EscapeKey from '../../utils/escape-key'
import extend from '../../utils/extend'
import ModelToggleMixin from '../../utils/mixin-model-toggle'
import { QTransition } from '../transition'
import { getScrollbarWidth } from '../../utils/scroll'

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
  mixins: [ModelToggleMixin],
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
    transition: String,
    enterClass: String,
    leaveClass: String,
    positionClasses: {
      type: String,
      default: 'flex-center'
    },
    contentClasses: [Object, Array, String],
    contentCss: [Object, Array, String],
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    },
    minimized: Boolean,
    maximized: Boolean
  },
  data () {
    return {
      active: false,
      toggleInProgress: false
    }
  },
  computed: {
    modalClasses () {
      const cls = this.position
        ? positions[this.position]
        : this.positionClasses
      if (this.maximized) {
        return ['maximized', cls]
      }
      else if (this.minimized) {
        return ['minimized', cls]
      }
      return cls
    },
    modalTransition () {
      if (this.position) {
        return `q-modal-${this.position}`
      }
      if (this.enterClass === void 0 && this.leaveClass === void 0) {
        return this.transition || 'q-modal'
      }
    },
    modalCss () {
      if (this.position) {
        const css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss]

        css.unshift(extend(
          {},
          positionCSS[this.$q.theme],
          additionalCSS(this.$q.theme, this.position)
        ))

        return css
      }

      return this.contentCss
    }
  },
  methods: {
    open (onShow) {
      if (this.active || this.toggleInProgress) {
        return
      }

      this.toggleInProgress = true
      const body = document.body

      body.appendChild(this.$el)
      body.classList.add('with-modal')
      this.bodyPadding = window.getComputedStyle(body).paddingRight
      body.style.paddingRight = `${getScrollbarWidth()}px`
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
            body.classList.remove('with-modal')
            body.style.paddingRight = this.bodyPadding
          }
          if (typeof this.__onClose === 'function') {
            this.__onClose()
          }
          this.toggleInProgress = false
          this.__updateModel(false)
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
        this.toggleInProgress = false
        this.__updateModel(true)
        this.$emit('open')
      }, duration)
    },
    close (onClose) {
      if (!this.active || this.toggleInProgress) {
        return
      }

      this.toggleInProgress = true
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
    __dismiss (onClick) {
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
