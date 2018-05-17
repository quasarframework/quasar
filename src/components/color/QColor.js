import FrameMixin from '../../mixins/input-frame'
import DisplayModeMixin from '../../mixins/display-mode'
import extend from '../../utils/extend'
import { QInputFrame } from '../input-frame'
import { QPopover } from '../popover'
import QColorPicker from './QColorPicker'
import { QBtn } from '../btn'
import { QModal } from '../modal'
import clone from '../../utils/clone'
import { getEventKey, stopAndPrevent } from '../../utils/event'

const contentCss = __THEME__ === 'ios'
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
      default: '#000'
    },
    formatModel: {
      type: String,
      default: 'auto',
      validator: v => ['auto', 'hex', 'rgb', 'hexa', 'rgba'].includes(v)
    },
    displayValue: String,
    placeholder: String,
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
      transition: __THEME__ === 'ios' ? 'q-modal-bottom' : 'q-modal'
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
    modalBtnColor () {
      return __THEME__ === 'mat'
        ? this.color
        : (this.dark ? 'light' : 'dark')
    }
  },
  methods: {
    toggle () {
      this[this.$refs.popup.showing ? 'hide' : 'show']()
    },
    show () {
      if (!this.disable) {
        this.__setModel(this.value || this.defaultValue)
        return this.$refs.popup.show()
      }
    },
    hide () {
      return this.$refs.popup.hide()
    },

    __handleKeyDown (e) {
      switch (getEventKey(e)) {
        case 13: // ENTER key
        case 32: // SPACE key
          stopAndPrevent(e)
          return this.show()
        case 8: // BACKSPACE key
          if (this.editable && this.clearable && this.actualValue.length) {
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
          props: extend({
            value: this.model || '#000',
            disable: this.disable,
            readonly: this.readonly,
            formatModel: this.formatModel,
            dark: this.dark,
            noParentField: true
          }, this.$attrs),
          on: {
            input: v => this.$nextTick(() => this.__setModel(v))
          }
        })
      ]

      if (modal) {
        child[__THEME__ === 'mat' ? 'push' : 'unshift'](h('div', {
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
                noRipple: true
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
            disable: this.disable,
            anchorClick: false,
            maxHeight: '100vh'
          },
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
            minimized: __THEME__ === 'mat',
            position: __THEME__ === 'ios' ? 'bottom' : null,
            transition: this.transition
          },
          on: {
            dismiss: () => this.__onHide(false, true)
          }
        }, this.__getPicker(h, true)),

      this.editable && this.clearable && this.actualValue.length
        ? h('QIcon', {
          slot: 'after',
          props: { name: this.$q.icon.input[`clear${this.isInverted ? 'Inverted' : ''}`] },
          nativeOn: { click: this.clear },
          staticClass: 'q-if-control'
        })
        : null,

      h('QIcon', {
        slot: 'after',
        props: { name: this.$q.icon.input.dropdown },
        staticClass: 'q-if-control'
      })
    ])
  }
}
