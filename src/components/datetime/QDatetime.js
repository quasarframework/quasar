import FrameMixin from '../../mixins/input-frame'
import DisplayModeMixin from '../../mixins/display-mode'
import extend from '../../utils/extend'
import { input, inline } from './datetime-props'
import { QInputFrame } from '../input-frame'
import { QPopover } from '../popover'
import QDatetimePicker from './QDatetimePicker'
import { QBtn } from '../btn'
import { clone, formatDate, isSameDate, isValid } from '../../utils/date'
import { QModal } from '../modal'
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
  name: 'QDatetime',
  mixins: [FrameMixin, DisplayModeMixin],
  props: extend(
    input,
    inline
  ),
  watch: {
    value (v) {
      if (!this.disable && this.$refs.popup && this.$refs.popup.showing) {
        this.model = clone(v)
      }
    }
  },
  data () {
    let data = this.isPopover ? {} : {
      transition: __THEME__ === 'ios' ? 'q-modal-bottom' : 'q-modal'
    }
    data.focused = false
    data.model = clone(isValid(this.value) ? this.value : this.defaultValue)
    return data
  },
  computed: {
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!isValid(this.value)) {
        return ''
      }

      let format

      if (this.format) {
        format = this.format
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD'
      }
      else if (this.type === 'time') {
        format = 'HH:mm'
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss'
      }

      return formatDate(this.value, format, /* for reactiveness */ this.$q.i18n.date)
    },
    modalBtnColor () {
      return this.$q.theme === 'mat'
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
        const val = isValid(this.value) ? this.value : this.defaultValue
        if (this.focused) {
          this.model = clone(val)
        }
        else {
          this.__setModel(val)
        }
        return this.$refs.popup.show()
      }
    },
    hide () {
      this.focused = false
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
      if (__THEME__ === 'mat') {
        const target = this.$refs.target
        if (this.defaultView && target.view !== this.defaultView) {
          target.setView(this.defaultView)
        }
        else {
          target.setView()
        }
      }
      this.__setModel(isValid(this.value) ? this.value : this.defaultValue)
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      if (this.$refs.popup && this.$refs.popup.showing) {
        return
      }

      this.__onHide()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popup.$el.contains(el)) {
          this.hide()
        }
      }, 1)
    },
    __onHide (forceUpdate) {
      this.focused = false
      this.$emit('blur')
      if (forceUpdate || (this.isPopover && this.$refs.popup.showing)) {
        this.__update(forceUpdate)
      }
    },
    __setModel (val, forceUpdate) {
      this.model = clone(val)
      if (forceUpdate || (this.isPopover && this.$refs.popup.showing)) {
        this.__update(forceUpdate)
      }
    },
    __update (change) {
      this.$nextTick(() => {
        if (!isSameDate(this.model, this.value)) {
          this.$emit('input', this.model)
          if (change) {
            this.$emit('change', this.model)
          }
        }
      })
    },
    __resetView () {
      // go back to initial entry point for that type of control
      // if it has defaultView it's going to be reapplied anyway on focus
      if (!this.defaultView) {
        this.$refs.target.setView()
      }
    },

    __getPicker (h, modal) {
      return [
        h(QDatetimePicker, {
          ref: 'target',
          staticClass: 'no-border',
          'class': {
            'datetime-ios-modal': __THEME__ === 'ios' && modal
          },
          props: {
            type: this.type,
            min: this.min,
            max: this.max,
            minimal: this.minimal,
            formatModel: this.formatModel,
            format24h: this.format24h,
            firstDayOfWeek: this.firstDayOfWeek,
            defaultView: this.defaultView,
            color: this.invertedLight ? 'grey-7' : this.color,
            dark: this.dark,
            value: this.model,
            disable: this.disable,
            readonly: this.readonly,
            noParentField: true
          },
          on: {
            input: v => this.$nextTick(() => this.__setModel(v)),
            canClose: () => {
              if (this.isPopover) {
                this.hide()
                this.__resetView()
              }
            }
          }
        }, [
          modal
            ? h('div', {
              staticClass: 'modal-buttons modal-buttons-top row full-width'
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
                    this.__onHide()
                    this.hide()
                    this.__resetView()
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
                      this.__onHide(true)
                      this.hide()
                      this.__resetView()
                    }
                  }
                })
                : null
            ])
            : null
        ])
      ]
    }
  },
  render (h) {
    return h(QInputFrame, {
      staticClass: 'q-datetime-input',
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
            hide: val => this.__onHide(true)
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
            dismiss: this.__onHide
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
