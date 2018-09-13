import FrameMixin from '../../mixins/input-frame.js'
import DisplayModeMixin from '../../mixins/display-mode.js'
import CanRenderMixin from '../../mixins/can-render.js'
import { input, inline } from './datetime-props.js'
import QInputFrame from '../input-frame/QInputFrame.js'
import QIcon from '../icon/QIcon.js'
import QPopover from '../popover/QPopover.js'
import QDatetimePicker from './QDatetimePicker'
import QBtn from '../btn/QBtn.js'
import { clone, formatDate, isSameDate, isValid, startOfDate } from '../../utils/date.js'
import QModal from '../modal/QModal.js'
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
  name: 'QDatetime',
  mixins: [FrameMixin, DisplayModeMixin, CanRenderMixin],
  props: Object.assign({}, input, inline),
  watch: {
    value (v) {
      if (!this.disable && this.isPopover) {
        this.model = clone(v)
      }
    }
  },
  data () {
    return {
      transition: null,
      model: null,
      focused: false
    }
  },
  created () {
    this.model = clone(this.computedValue)

    if (!this.isPopover) {
      this.transition = process.env.THEME === 'ios' ? 'q-modal-bottom' : 'q-modal'
    }
  },
  computed: {
    computedFormat () {
      if (this.format) {
        return this.format
      }
      if (this.type === 'date') {
        return 'YYYY/MM/DD'
      }
      return this.type === 'time' ? 'HH:mm' : 'YYYY/MM/DD HH:mm:ss'
    },
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!isValid(this.value) || !this.canRender) {
        return ''
      }

      return formatDate(this.value, this.computedFormat, /* for reactiveness */ this.$q.i18n.date)
    },
    computedValue () {
      if (isValid(this.value)) {
        return this.value
      }
      if (process.env.THEME === 'ios') {
        return this.defaultValue || startOfDate(new Date(), 'day')
      }
      return this.defaultValue
    },
    computedClearValue () {
      return this.clearValue === void 0 ? this.defaultValue : this.clearValue
    },
    isClearable () {
      return this.editable && this.clearable && !isSameDate(this.computedClearValue, this.value)
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
        this.__setModel(this.computedValue)
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
      if (process.env.THEME === 'mat') {
        const target = this.$refs.target
        target && target.setView(this.defaultView, true)
      }
      this.model = clone(this.computedValue)
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
    __scrollView () {
      if (process.env.THEME === 'mat') {
        const target = this.$refs.target
        target && target.__scrollView()
      }
    },

    __getPicker (h, modal) {
      return [
        h(QDatetimePicker, {
          ref: 'target',
          staticClass: 'no-border',
          'class': {
            'datetime-ios-modal': process.env.THEME === 'ios' && modal
          },
          props: {
            type: this.type,
            min: this.min,
            max: this.max,
            headerLabel: this.headerLabel,
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
            cover: true,
            keepOnScreen: true,
            disable: this.disable,
            anchorClick: false,
            maxHeight: '100vh'
          },
          slot: 'after',
          on: {
            show: ev => {
              this.__onFocus(ev)
              this.__scrollView()
            },
            hide: () => this.__onHide(true, true)
          }
        }, this.__getPicker(h))
        : h(QModal, {
          ref: 'popup',
          staticClass: 'with-backdrop q-datetime-modal',
          props: {
            contentCss,
            minimized: process.env.THEME === 'mat',
            position: process.env.THEME === 'ios' ? 'bottom' : null,
            transition: this.transition
          },
          on: {
            show: this.__scrollView,
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
