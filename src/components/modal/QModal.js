import EscapeKey from '../../utils/escape-key'
import extend from '../../utils/extend'
import ModelToggleMixin from '../../mixins/model-toggle'

const positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
}
const positionCSS = __THEME__ === 'mat'
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
  if (__THEME__ === 'ios') {
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

let openedModalNumber = 0

export default {
  name: 'q-modal',
  mixins: [ModelToggleMixin],
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
    minimized: Boolean,
    maximized: Boolean
  },
  data () {
    return {
      contentStaticClasses: ''
    }
  },
  watch: {
    $route () {
      if (!this.noRouteDismiss) {
        this.hide()
      }
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
    transitionProps () {
      if (this.position) {
        return { name: `q-modal-${this.position}` }
      }
      if (this.enterClass === void 0 && this.leaveClass === void 0) {
        return { name: this.transition || 'q-modal' }
      }
      return {
        enterActiveClass: this.enterClass,
        leaveActiveClass: this.leaveClass
      }
    },
    modalCss () {
      if (this.position) {
        const css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss]

        css.unshift(extend(
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
        return
      }
      this.hide().then(() => {
        this.$emit('dismiss')
      })
    },
    __show () {
      const body = document.body

      body.appendChild(this.$el)
      body.classList.add('with-modal')

      EscapeKey.register(() => {
        if (!this.noEscDismiss) {
          this.hide().then(() => {
            this.$emit('escape-key')
          })
        }
      })

      openedModalNumber++

      let content = this.$refs.content
      content.scrollTop = 0
      ;['modal-scroll', 'layout-view'].forEach(c => {
        [].slice.call(content.getElementsByClassName(c)).forEach(el => {
          el.scrollTop = 0
        })
      })
    },
    __hide () {
      EscapeKey.pop()
      openedModalNumber--

      if (openedModalNumber === 0) {
        const body = document.body

        body.classList.remove('with-modal')
      }
    }
  },
  mounted () {
    this.contentStaticClasses = 'modal-content scroll'

    // Add column class to q-modal when q-modal-layout, this permits the content to grow and have scrolling in between the header and footer
    // Class column cannot be imposed when there is no q-modal-layout child since this will change the behavior of the contents
    if (this.$el.firstChild) {
      if (this.$el.firstChild.firstChild) {
        if (this.$el.firstChild.firstChild.className.search('q-modal-layout') >= 0) {
          this.contentStaticClasses += ' column'
        }
      }
    }

    if (this.value) {
      this.show()
    }
  },
  beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
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
        },
        afterLeave: () => {
          this.hidePromise && this.hidePromiseResolve()
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
          staticClass: this.contentStaticClasses,
          style: this.modalCss,
          'class': this.contentClasses,
          on: {
            click (e) {
              e.stopPropagation()
            },
            touchstart (e) {
              e.stopPropagation()
            }
          }
        }, [ this.$slots.default ])
      ])
    ])
  }
}
