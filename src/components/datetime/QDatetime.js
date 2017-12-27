import FrameMixin from '../../mixins/input-frame'
import extend from '../../utils/extend'
import { input, inline } from './datetime-props'
import { QInputFrame } from '../input-frame'
import { QPopover } from '../popover'
import QDatetimePicker from './QDatetimePicker'
import { QBtn } from '../btn'
import { formatDate } from '../../utils/date'
import { QModal } from '../modal'
import clone from '../../utils/clone'
import { stopAndPrevent } from '../../utils/event'

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
  name: 'q-datetime',
  mixins: [FrameMixin],
  props: extend(
    input,
    inline
  ),
  data () {
    let data = this.isPopover() ? {} : {
      transition: __THEME__ === 'ios' ? 'q-modal-bottom' : 'q-modal'
    }
    data.focused = false
    data.model = this.defaultSelection
    return data
  },
  computed: {
    usingPopover () {
      return this.$q.platform.is.desktop && !this.$q.platform.within.iframe
    },
    editable () {
      return !this.disable && !this.readonly
    },
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.value) {
        return this.placeholder || ''
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
    }
  },
  methods: {
    isPopover () {
      return this.$q.platform.is.desktop && !this.$q.platform.within.iframe
    },
    toggle () {
      this[this.$refs.popup.showing ? 'hide' : 'show']()
    },
    show () {
      if (!this.disable) {
        this.__setModel()
        return this.$refs.popup.show()
      }
    },
    hide () {
      this.focused = false
      return this.$refs.popup.hide()
    },
    clear (evt) {
      stopAndPrevent(evt)
      this.$emit('input', '')
      this.$emit('change', '')
    },

    __onFocus () {
      if (this.defaultView) {
        const target = this.$refs.target
        if (target.view !== this.defaultView) {
          target.setView(this.defaultView)
        }
        else {
          target.__scrollView()
        }
      }
      this.__setModel(this.value)
      this.focused = true
      this.$emit('focus')
    },
    __onBlur (e) {
      this.__onHide()
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && !this.$refs.popup.$el.contains(el)) {
          this.hide()
        }
      }, 1)
    },
    __onHide () {
      this.focused = false
      this.$emit('blur')
      if (this.usingPopover) {
        this.__update(true)
      }
    },
    __setModel (val = this.value) {
      this.model = val
        ? clone(val)
        : this.defaultSelection
    },
    __update (change) {
      const val = this.model || this.$refs.target.model
      this.$emit('input', val)
      if (change) {
        this.$emit('change', val)
      }
    },

    __getPicker (h, modal) {
      return [
        h(QDatetimePicker, {
          ref: 'target',
          staticClass: `no-border`,
          props: {
            type: this.type,
            min: this.min,
            max: this.max,
            format24h: this.format24h,
            firstDayOfWeek: this.firstDayOfWeek,
            defaultView: this.defaultView,
            color: this.color,
            value: this.model,
            disable: this.disable,
            readonly: this.readonly
          },
          on: {
            input: v => {
              this.model = v
              if (this.usingPopover) {
                this.__update()
              }
            },
            change: v => {
              this.model = v
            },
            canClose: () => {
              if (this.usingPopover) {
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
                  color: this.color,
                  flat: true,
                  label: this.cancelLabel || this.$q.i18n.label.cancel,
                  waitForRipple: true,
                  dense: true
                },
                on: { click: this.hide }
              }),
              this.editable
                ? h(QBtn, {
                  props: {
                    color: this.color,
                    flat: true,
                    label: this.okLabel || this.$q.i18n.label.set,
                    waitForRipple: true,
                    dense: true
                  },
                  on: {
                    click: () => {
                      this.hide()
                      this.__update(true)
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
      props: {
        prefix: this.prefix,
        suffix: this.suffix,
        stackLabel: this.stackLabel,
        floatLabel: this.floatLabel,
        error: this.error,
        warning: this.warning,
        disable: this.disable,
        inverted: this.inverted,
        dark: this.dark,
        hideUnderline: this.hideUnderline,
        before: this.before,
        after: this.after,
        color: this.color,

        focused: this.focused,
        focusable: true,
        length: this.actualValue.length
      },
      nativeOn: {
        click: this.toggle,
        focus: this.__onFocus,
        blur: this.__onBlur
      }
    }, [
      h('div', {
        staticClass: 'col row items-center q-input-target',
        'class': this.alignClass,
        domProps: {
          innerHTML: this.actualValue
        }
      }),

      this.usingPopover
        ? h(QPopover, {
          ref: 'popup',
          props: {
            offset: [0, 10],
            disable: this.disable,
            anchorClick: false,
            maxHeight: '100vh'
          },
          on: {
            show: this.__onFocus,
            hide: this.__onHide
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
            show: this.__onFocus,
            hide: this.__onHide
          }
        }, this.__getPicker(h, true)),

      this.editable && this.clearable && this.actualValue.length
        ? h('q-icon', {
          slot: 'after',
          props: { name: this.$q.icon.input.clear },
          nativeOn: { click: this.clear },
          staticClass: 'q-if-control'
        })
        : null,

      h('q-icon', {
        slot: 'after',
        props: { name: this.$q.icon.input.dropdown },
        staticClass: 'q-if-control'
      })
    ])
  }
}
