import QPopover from '../popover/QPopover.js'
import QBtn from '../btn/QBtn.js'
import clone from '../../utils/clone.js'
import { getEventKey } from '../../utils/event.js'

export default {
  name: 'QPopupEdit',
  props: {
    value: {},
    persistent: Boolean,
    keepOnScreen: {
      type: Boolean,
      default: true
    },
    title: String,
    buttons: Boolean,
    labelSet: String,
    labelCancel: String,
    color: {
      type: String,
      default: 'primary'
    },
    validate: {
      type: Function,
      default: () => true
    },
    disable: Boolean
  },
  data () {
    return {
      initialValue: ''
    }
  },
  watch: {
    value () {
      this.$nextTick(() => {
        this.$refs.popover.reposition()
      })
    }
  },
  methods: {
    cancel () {
      if (this.__hasChanged()) {
        this.$emit('cancel', this.value, this.initialValue)
        this.$emit('input', this.initialValue)
      }
      this.$nextTick(this.__close)
    },
    set () {
      if (this.__hasChanged() && this.validate(this.value)) {
        this.$emit('save', this.value, this.initialValue)
      }
      this.__close()
    },

    __hasChanged () {
      return JSON.stringify(this.value) !== JSON.stringify(this.initialValue)
    },
    __close () {
      this.validated = true
      this.$refs.popover.hide()
    },
    __getContent (h) {
      const title = this.$slots.title || this.title
      return [
        (title && h('div', { staticClass: 'q-title q-mt-sm q-mb-sm' }, [ title ])) || void 0
      ].concat(this.$slots.default).concat([
        (this.buttons && h('div', { staticClass: 'row justify-center no-wrap q-mt-sm' }, [
          h(QBtn, {
            props: {
              flat: true,
              color: this.color,
              label: this.labelCancel || this.$q.i18n.label.cancel
            },
            on: {
              click: this.cancel
            }
          }),
          h(QBtn, {
            staticClass: 'q-ml-sm',
            props: {
              flat: true,
              color: this.color,
              label: this.labelSet || this.$q.i18n.label.set
            },
            on: {
              click: this.set
            }
          })
        ])) || void 0
      ])
    }
  },
  render (h) {
    return h(QPopover, {
      staticClass: 'q-table-edit q-px-md q-py-sm',
      ref: 'popover',
      props: {
        cover: true,
        persistent: this.persistent,
        keepOnScreen: this.keepOnScreen,
        disable: this.disable
      },
      on: {
        show: () => {
          const input = this.$el.querySelector('.q-input-target, input')
          input && input.focus()
          this.$emit('show')
          this.initialValue = clone(this.value)
          this.validated = false
        },
        hide: () => {
          if (this.validated) { return }

          if (this.__hasChanged()) {
            if (this.validate(this.value)) {
              this.$emit('save', this.value, this.initialValue)
            }
            else {
              this.$emit('cancel', this.value, this.initialValue)
              this.$emit('input', this.initialValue)
            }
          }

          this.$emit('hide')
        }
      },
      nativeOn: {
        keydown: e => {
          if (getEventKey(e) === 13) {
            this.$refs.popover.hide()
          }
        }
      }
    }, this.__getContent(h))
  }
}
