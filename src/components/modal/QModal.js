import EscapeKey from '../../utils/escape-key.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import preventScroll from '../../utils/prevent-scroll.js'

const positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
}
const positionCSS = process.env.THEME === 'mat'
  ? {
    maxHeight: '80vh',
    height: 'auto'
  }
  : {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none'
  }

function additionalCSS (position) {
  let css = {}

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw'
  }

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

  return css
}

let modals = {
  responsive: 0,
  maximized: 0
}

export default {
  name: 'QModal',
  mixins: [ModelToggleMixin],
  provide () {
    return {
      __qmodal: {
        register: layout => {
          if (this.layout !== layout) {
            this.layout = layout
          }
        },
        unregister: layout => {
          if (this.layout === layout) {
            this.layout = null
          }
        }
      }
    }
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
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    minimized: Boolean,
    maximized: Boolean
  },
  data () {
    return {
      layout: null
    }
  },
  watch: {
    $route () {
      if (!this.noRouteDismiss) {
        this.hide()
      }
    },
    maximized (newV, oldV) {
      this.__register(false, oldV)
      this.__register(true, newV)
    },
    minimized (newV, oldV) {
      this.__register(false, this.maximized, oldV)
      this.__register(true, this.maximized, newV)
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
    contentClassesCalc () {
      if (this.layout) {
        return [this.contentClasses, 'column no-wrap']
      }
      return this.contentClasses
    },
    transitionProps () {
      if (this.position) {
        return { name: `q-modal-${this.position}` }
      }
      if (this.enterClass || this.leaveClass) {
        return {
          enterActiveClass: this.enterClass,
          leaveActiveClass: this.leaveClass
        }
      }
      return { name: this.transition || 'q-modal' }
    },
    modalCss () {
      if (this.position) {
        const css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss]

        css.unshift(Object.assign(
          {},
          positionCSS,
          additionalCSS(this.position)
        ))

        return css
      }

      return this.contentCss
    }
  },
  methods: {
    __dismiss () {
      if (this.noBackdropDismiss) {
        this.__shake()
        return
      }
      this.hide().then(() => {
        this.$emit('dismiss')
      })
    },
    __show () {
      if (!this.noRefocus) {
        this.__refocusTarget = document.activeElement
      }

      document.body.appendChild(this.$el)
      this.__register(true)
      preventScroll(true)

      EscapeKey.register(() => {
        if (this.noEscDismiss) {
          this.__shake()
        }
        else {
          this.hide().then(() => {
            this.$emit('escape-key')
            this.$emit('dismiss')
          })
        }
      })

      const content = this.$refs.content
      if (this.$q.platform.is.ios) {
        // workaround the iOS hover/touch issue
        content.click()
      }
      content.scrollTop = 0
      ;['modal-scroll', 'layout-view'].forEach(c => {
        [].slice.call(content.getElementsByClassName(c)).forEach(el => {
          el.scrollTop = 0
        })
      })
      this.$nextTick(() => content && content.focus())
    },
    __hide () {
      EscapeKey.pop()
      preventScroll(false)
      this.__register(false)
      !this.noRefocus && this.__refocusTarget && this.__refocusTarget.focus()
    },
    __stopPropagation (e) {
      e.stopPropagation()
    },
    __register (opening, maximized = this.maximized, minimized = this.minimized) {
      let state = opening
        ? { action: 'add', step: 1 }
        : { action: 'remove', step: -1 }

      if (maximized) {
        modals.maximized += state.step
        if (!opening && modals.maximized > 0) {
          return
        }
        document.body.classList[state.action]('q-maximized-modal')
      }
      else if (!minimized) {
        modals.responsive += state.step
        if (!opening && modals.responsive > 0) {
          return
        }
        document.body.classList[state.action]('q-responsive-modal')
      }
    },
    __shake () {
      this.$el.classList.remove('animate-shake')
      this.$el.classList.add('animate-shake')
      clearTimeout(this.shakeTimeout)
      this.shakeTimeout = setTimeout(() => {
        this.$el.classList.remove('animate-shake')
      }, 150)
    }
  },
  mounted () {
    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    clearTimeout(this.shakeTimeout)
    this.$el.remove()
  },
  render (h) {
    return h('transition', {
      props: this.transitionProps,
      on: {
        afterEnter: () => {
          this.showPromise && this.showPromiseResolve()
        },
        enterCancelled: () => {
          this.showPromise && this.showPromiseReject()
          this.$el.remove()
        },
        afterLeave: () => {
          this.hidePromise && this.hidePromiseResolve()
          this.$el.remove()
        },
        leaveCancelled: () => {
          this.hidePromise && this.hidePromiseReject()
        }
      }
    }, [
      h('div', {
        staticClass: 'modal fullscreen row',
        'class': this.modalClasses,
        on: {
          click: this.__dismiss
        },
        directives: [{
          name: 'show',
          value: this.showing
        }]
      }, [
        h('div', {
          ref: 'content',
          staticClass: 'modal-content',
          style: this.modalCss,
          'class': this.contentClassesCalc,
          attrs: { tabindex: -1 },
          on: {
            click: this.__stopPropagation,
            touchstart: this.__stopPropagation
          }
        }, this.$slots.default)
      ])
    ])
  }
}
