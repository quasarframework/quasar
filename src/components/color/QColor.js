import FrameMixin from '../../mixins/input-frame.js'
import DisplayModeMixin from '../../mixins/display-mode.js'
import QInputFrame from '../input-frame/QInputFrame.js'
import QPopover from '../popover/QPopover.js'
import QColorPicker from './QColorPicker.js'
import QBtn from '../btn/QBtn.js'
import QModal from '../modal/QModal.js'
import QIcon from '../icon/QIcon.js'
import clone from '../../utils/clone.js'
import { getEventKey, stopAndPrevent } from '../../utils/event.js'

const contentCss = process.env.THEME === 'ios'
  ? {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  }
  : {
    maxWidth: '95vw',
    maxHeight: '98vh'
  }

export default {
  name: 'QColor',
  mixins: [FrameMixin, DisplayModeMixin],
  props: {
    value: {
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    defaultValue: {
      type: [String, Object],
      default: null
    },
    formatModel: {
      type: String,
      default: 'auto',
      validator: v => ['auto', 'hex', 'rgb', 'hexa', 'rgba'].includes(v)
    },
    displayValue: String,
    okLabel: String,
    cancelLabel: String
  },
  watch: {
    value (v) {
      if (!this.disable && this.isPopover) {
        this.model = clone(v)
      }
    }
  },
  data () {
    let data = this.isPopover ? {} : {
      transition: process.env.THEME === 'ios' ? 'q-modal-bottom' : 'q-modal'
    }
    data.focused = false
    data.model = clone(this.value || this.defaultValue)
    return data
  },
  computed: {
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }

      if (this.value) {
        return typeof this.value === 'string'
          ? this.value
          : `rgb${this.value.a !== void 0 ? 'a' : ''}(${this.value.r},${this.value.g},${this.value.b}${this.value.a !== void 0 ? `,${this.value.a / 100}` : ''})`
      }

      return ''
    },
    computedClearValue () {
      return this.clearValue === void 0 ? this.defaultValue : this.clearValue
    },
    isClearable () {
      return this.editable && this.clearable && JSON.stringify(this.computedClearValue) !== JSON.stringify(this.value)
    },
    modalBtnColor () {
      return process.env.THEME === 'mat'
        ? this.color
        : (this.dark ? 'light' : 'dark')
    }
  },
  methods: {
    toggle () {
      this.$refs.popup && this[this.$refs.popup.showing ? 'hide' : 'show']()
    },
    show () {
      if (!this.disable) {
        this.__setModel(this.value || this.defaultValue)
        return this.$refs.popup.show()
      }
    },
    hide () {
      return this.$refs.popup ? this.$refs.popup.hide() : Promise.resolve()
    },

    __handleKeyDown (e) {
      switch (getEventKey(e)) {
        case 13: // ENTER key
        case 32: // SPACE key
          stopAndPrevent(e)
          return this.show()
        case 8: // BACKSPACE key
          if (this.isClearable) {
            this.clear()
          }
      }
    },
    __onFocus () {
      if (this.disable || this.focused) {
        return
      }
      this.model = clone(this.value || this.defaultValue)
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      if (!this.focused) {
        return
      }

      setTimeout(() => {
        const el = document.activeElement
        if (
          !this.$refs.popup ||
          !this.$refs.popup.showing ||
          (el !== document.body && !this.$refs.popup.$el.contains(el))
        ) {
          this.__onHide()
          this.hide()
        }
      }, 1)
    },
    __onHide (forceUpdate, keepFocus) {
      if (forceUpdate || this.isPopover) {
        this.__update(forceUpdate)
      }
      if (!this.focused) {
        return
      }
      if (keepFocus) {
        this.$el.focus()
        return
      }
      this.$emit('blur')
      this.focused = false
    },
    __setModel (val, forceUpdate) {
      this.model = clone(val)
      if (forceUpdate || this.isPopover) {
        this.__update(forceUpdate)
      }
    },
    __hasModelChanged () {
      return JSON.stringify(this.model) !== JSON.stringify(this.value)
    },
    __update (change) {
      this.$nextTick(() => {
        if (this.__hasModelChanged()) {
          this.$emit('input', this.model)
          if (change) {
            this.$emit('change', this.model)
          }
        }
      })
    },

    __getPicker (h, modal) {
      const child = [
        h(QColorPicker, {
          staticClass: `no-border${modal ? ' full-width' : ''}`,
          props: Object.assign({}, this.$attrs, {
            value: this.model,
            disable: this.disable,
            readonly: this.readonly,
            formatModel: this.formatModel,
            dark: this.dark,
            noParentField: true
          }),
          on: {
            input: v => this.$nextTick(() => this.__setModel(v))
          }
        })
      ]

      if (modal) {
        child[process.env.THEME === 'mat' ? 'push' : 'unshift'](h('div', {
          staticClass: 'modal-buttons modal-buttons-top row full-width',
          'class': this.dark ? 'bg-black' : null
        }, [
          h('div', { staticClass: 'col' }),
          h(QBtn, {
            props: {
              color: this.modalBtnColor,
              flat: true,
              label: this.cancelLabel || this.$q.i18n.label.cancel,
              noRipple: true
            },
            on: {
              click: () => {
                this.__onHide(false, true)
                this.hide()
              }
            }
          }),
          this.editable
            ? h(QBtn, {
              props: {
                color: this.modalBtnColor,
                flat: true,
                label: this.okLabel || this.$q.i18n.label.set,
                noRipple: true,
                disable: !this.model
              },
              on: {
                click: () => {
                  this.__onHide(true, true)
                  this.hide()
                }
              }
            })
            : null
        ]))
      }

      return child
    }
  },
  render (h) {
    return h(QInputFrame, {
      staticClass: 'q-color-input',
      props: {
        prefix: this.prefix,
        suffix: this.suffix,
        stackLabel: this.stackLabel,
        floatLabel: this.floatLabel,
        error: this.error,
        warning: this.warning,
        disable: this.disable,
        readonly: this.readonly,
        inverted: this.inverted,
        invertedLight: this.invertedLight,
        dark: this.dark,
        hideUnderline: this.hideUnderline,
        before: this.before,
        after: this.after,
        color: this.color,
        noParentField: this.noParentField,

        focused: this.focused || (this.$refs.popup && this.$refs.popup.showing),
        focusable: true,
        length: this.actualValue.length
      },
      nativeOn: {
        click: this.toggle,
        focus: this.__onFocus,
        blur: this.__onBlur,
        keydown: this.__handleKeyDown
      }
    }, [
      h('div', {
        staticClass: 'col q-input-target ellipsis',
        'class': this.fakeInputClasses
      }, [
        this.fakeInputValue
      ]),

      this.isPopover
        ? h(QPopover, {
          ref: 'popup',
          props: {
            cover: true,
            keepOnScreen: true,
            disable: this.disable,
            anchorClick: false,
            maxHeight: '100vh'
          },
          slot: 'after',
          on: {
            show: this.__onFocus,
            hide: () => this.__onHide(true, true)
          }
        }, this.__getPicker(h))
        : h(QModal, {
          ref: 'popup',
          staticClass: 'with-backdrop',
          props: {
            contentCss,
            minimized: process.env.THEME === 'mat',
            position: process.env.THEME === 'ios' ? 'bottom' : null,
            transition: this.transition
          },
          on: {
            dismiss: () => this.__onHide(false, true)
          }
        }, this.__getPicker(h, true)),

      this.isClearable
        ? h(QIcon, {
          slot: 'after',
          props: { name: this.$q.icon.input[`clear${this.isInverted ? 'Inverted' : ''}`] },
          nativeOn: { click: this.clear },
          staticClass: 'q-if-control'
        })
        : null,

      h(QIcon, {
        slot: 'after',
        props: { name: this.$q.icon.input.dropdown },
        staticClass: 'q-if-control'
      })
    ])
  }
}
