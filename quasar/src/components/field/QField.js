import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import ValidateMixin from '../../mixins/validate.js'
import slot from '../../utils/slot.js'
import { stop } from '../../utils/event.js'

export default Vue.extend({
  name: 'QField',

  inheritAttrs: false,

  mixins: [ ValidateMixin ],

  props: {
    label: String,
    stackLabel: Boolean,
    hint: String,
    hideHint: Boolean,
    prefix: String,
    suffix: String,

    color: String,
    bgColor: String,
    dark: Boolean,

    filled: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    standout: [Boolean, String],

    square: Boolean,

    loading: Boolean,

    bottomSlots: Boolean,
    hideBottomSpace: Boolean,

    rounded: Boolean,
    dense: Boolean,
    itemAligned: Boolean,

    counter: Boolean,

    clearable: Boolean,
    clearIcon: String,

    disable: Boolean,
    readonly: Boolean,

    autofocus: Boolean,

    maxlength: [Number, String],
    maxValues: [Number, String] // do not add to JSON, internally needed by QSelect
  },

  data () {
    return {
      focused: false,

      // used internally by validation for QInput
      // or menu handling for QSelect
      innerLoading: false
    }
  },

  computed: {
    editable () {
      return this.disable !== true && this.readonly !== true
    },

    hasValue () {
      const value = this.__getControl === void 0 ? this.value : this.innerValue

      return value !== void 0 &&
        value !== null &&
        ('' + value).length > 0
    },

    computedCounter () {
      if (this.counter !== false) {
        const len = typeof this.value === 'string' || typeof this.value === 'number'
          ? ('' + this.value).length
          : (Array.isArray(this.value) === true ? this.value.length : 0)
        const max = this.maxlength !== void 0 ? this.maxlength : this.maxValues

        return len + (max !== void 0 ? ' / ' + max : '')
      }
    },

    floatingLabel () {
      return this.hasError === true ||
        this.stackLabel === true ||
        this.focused === true ||
        this.hasValue === true ||
        (
          this.displayValue !== void 0 &&
          this.displayValue !== null &&
          ('' + this.displayValue).length > 0
        )
    },

    hasBottom () {
      return this.bottomSlots === true || this.hint !== void 0 || this.rules !== void 0 || this.counter === true
    },

    classes () {
      return {
        [this.fieldClass]: this.fieldClass !== void 0,

        [`q-field--${this.styleType}`]: true,
        'q-field--rounded': this.rounded,
        'q-field--square': this.square,

        'q-field--focused': this.focused === true || this.hasError === true,
        'q-field--float': this.floatingLabel,
        'q-field--labeled': this.label !== void 0,

        'q-field--dense': this.dense,
        'q-field--item-aligned q-item-type': this.itemAligned,
        'q-field--dark': this.dark,

        'q-field--auto-height': this.__getControl === void 0,

        'q-field--with-bottom': this.hideBottomSpace !== true && this.hasBottom,
        'q-field--error': this.hasError,

        'q-field--readonly': this.readonly,
        'q-field--disabled': this.disable
      }
    },

    styleType () {
      if (this.filled === true) { return 'filled' }
      if (this.outlined === true) { return 'outlined' }
      if (this.borderless === true) { return 'borderless' }
      if (this.standout) { return 'standout' }
      return 'standard'
    },

    contentClass () {
      const cls = []

      if (this.hasError) {
        cls.push('text-negative')
      }
      else if (typeof this.standout === 'string' && this.standout.length > 0 && this.focused === true) {
        return this.standout
      }
      else if (this.color !== void 0) {
        cls.push('text-' + this.color)
      }

      if (this.bgColor !== void 0) {
        cls.push(`bg-${this.bgColor}`)
      }

      return cls
    }
  },

  methods: {
    focus () {
      let target = this.$refs.target
      if (target !== void 0) {
        target.matches('[tabindex]') || (target = target.querySelector('[tabindex]'))
        target !== null && target.focus()
      }
    },

    blur () {
      const el = document.activeElement
      this.$el.contains(el) && el.blur()
    },

    __getContent (h) {
      const node = []

      this.$scopedSlots.prepend !== void 0 && node.push(
        h('div', {
          staticClass: 'q-field__prepend q-field__marginal row no-wrap items-center',
          key: 'prepend'
        }, this.$scopedSlots.prepend())
      )

      node.push(
        h('div', {
          staticClass: 'q-field__control-container col relative-position row no-wrap q-anchor--skip'
        }, this.__getControlContainer(h))
      )

      this.hasError === true && this.noErrorIcon === false && node.push(
        this.__getInnerAppendNode(h, 'error', [
          h(QIcon, { props: { name: this.$q.iconSet.field.error, color: 'negative' } })
        ])
      )

      if (this.loading === true || this.innerLoading === true) {
        node.push(
          this.__getInnerAppendNode(
            h,
            'inner-loading-append',
            this.$scopedSlots.loading !== void 0
              ? this.$scopedSlots.loading()
              : [ h(QSpinner, { props: { color: this.color } }) ]
          )
        )
      }

      if (this.clearable === true && this.hasValue === true && this.editable === true) {
        node.push(
          this.__getInnerAppendNode(h, 'inner-clearable-append', [
            h(QIcon, {
              staticClass: 'cursor-pointer',
              props: { name: this.clearIcon || this.$q.iconSet.field.clear },
              on: {
                click: this.__clearValue
              }
            })
          ])
        )
      }

      this.$scopedSlots.append !== void 0 && node.push(
        h('div', {
          staticClass: 'q-field__append q-field__marginal row no-wrap items-center',
          key: 'append'
        }, this.$scopedSlots.append())
      )

      this.__getInnerAppend !== void 0 && node.push(
        this.__getInnerAppendNode(h, 'inner-append', this.__getInnerAppend(h))
      )

      this.__getPopup !== void 0 && node.push(
        this.__getPopup(h)
      )

      return node
    },

    __getControlContainer (h) {
      const node = []

      this.prefix !== void 0 && this.prefix !== null && node.push(
        h('div', {
          staticClass: 'q-field__prefix no-pointer-events row items-center'
        }, [ this.prefix ])
      )

      if (this.__getControl !== void 0) {
        node.push(
          this.__getControl(h)
        )
      }
      else if (this.$scopedSlots.control !== void 0) {
        node.push(
          h('div', {
            ref: 'target',
            staticClass: 'q-field__native row',
            attrs: {
              ...this.$attrs,
              autofocus: this.autofocus
            }
          }, this.$scopedSlots.control())
        )
      }

      this.label !== void 0 && node.push(
        h('div', {
          staticClass: 'q-field__label no-pointer-events absolute ellipsis'
        }, [ this.label ])
      )

      this.suffix !== void 0 && this.suffix !== null && node.push(
        h('div', {
          staticClass: 'q-field__suffix no-pointer-events row items-center'
        }, [ this.suffix ])
      )

      return node.concat(
        this.__getDefaultSlot !== void 0
          ? this.__getDefaultSlot(h)
          : slot(this, 'default')
      )
    },

    __getBottom (h) {
      if (this.hideBottomSpace !== true && this.hasBottom !== true) { return }

      let msg, key

      if (this.hasError === true) {
        if (this.computedErrorMessage !== void 0) {
          msg = [ h('div', [ this.computedErrorMessage ]) ]
          key = this.computedErrorMessage
        }
        else {
          msg = slot(this, 'error')
          key = 'q--slot-error'
        }
      }
      else if (this.hideHint !== true || this.focused === true) {
        if (this.hint !== void 0) {
          msg = [ h('div', [ this.hint ]) ]
          key = this.hint
        }
        else {
          msg = slot(this, 'hint')
          key = 'q--slot-hint'
        }
      }

      const hasCounter = this.counter === true || this.$scopedSlots.counter !== void 0

      if (this.hideBottomSpace === true && hasCounter === false && !msg) {
        return
      }

      const main = h('div', {
        staticClass: 'q-field__messages col',
        key
      }, msg)

      return h('div', {
        staticClass: 'q-field__bottom row items-start q-field__bottom--' +
          (this.hideBottomSpace !== true ? 'animated' : 'stale')
      }, [
        this.hideBottomSpace === true
          ? main
          : h('transition', { props: { name: 'q-transition--field-message' } }, [
            main
          ]),

        hasCounter === true ? h('div', {
          staticClass: 'q-field__counter'
        }, this.$scopedSlots.counter !== void 0 ? this.$scopedSlots.counter() : [ this.computedCounter ]) : null
      ])
    },

    __getInnerAppendNode (h, key, content) {
      return h('div', {
        staticClass: 'q-field__append q-field__marginal row no-wrap items-center q-anchor--skip',
        key
      }, content)
    },

    __onControlPopupShow (e) {
      this.hasPopupOpen = true
      this.__onControlFocusin(e)
    },

    __onControlPopupHide (e) {
      this.hasPopupOpen = false
      this.__onControlFocusout(e)
    },

    __onControlFocusin (e) {
      if (this.editable === true && this.focused === false) {
        this.focused = true
        this.$listeners.focus !== void 0 && this.$emit('focus', e)
      }
    },

    __onControlFocusout (e) {
      setTimeout(() => {
        if (
          document.hasFocus() === true && (
            this.hasPopupOpen === true ||
            this.$refs === void 0 ||
            this.$refs.control === void 0 ||
            this.$refs.control.contains(document.activeElement) !== false
          )
        ) {
          return
        }

        this.hasPopupOpen = false

        if (this.focused === true) {
          this.focused = false
          this.$listeners.blur !== void 0 && this.$emit('blur', e)
        }
      })
    },

    __clearValue (e) {
      stop(e)
      this.$emit('input', null)
    }
  },

  render (h) {
    this.__onPreRender !== void 0 && this.__onPreRender()
    this.__onPostRender !== void 0 && this.$nextTick(this.__onPostRender)

    return h('div', {
      staticClass: 'q-field row no-wrap items-start',
      class: this.classes
    }, [
      this.$scopedSlots.before !== void 0 ? h('div', {
        staticClass: 'q-field__before q-field__marginal row no-wrap items-center'
      }, this.$scopedSlots.before()) : null,

      h('div', {
        staticClass: 'q-field__inner relative-position col self-stretch column justify-center'
      }, [
        h('div', {
          ref: 'control',
          staticClass: 'q-field__control relative-position row no-wrap',
          class: this.contentClass,
          attrs: { tabindex: -1 },
          on: this.controlEvents
        }, this.__getContent(h)),

        this.__getBottom(h)
      ]),

      this.$scopedSlots.after !== void 0 ? h('div', {
        staticClass: 'q-field__after q-field__marginal row no-wrap items-center'
      }, this.$scopedSlots.after()) : null
    ])
  },

  created () {
    this.__onPreRender !== void 0 && this.__onPreRender()

    this.controlEvents = this.__getControlEvents !== void 0
      ? this.__getControlEvents()
      : {
        focus: this.focus,
        focusin: this.__onControlFocusin,
        focusout: this.__onControlFocusout,
        'popup-show': this.__onControlPopupShow,
        'popup-hide': this.__onControlPopupHide
      }
  },

  mounted () {
    this.autofocus === true && setTimeout(this.focus)
  }
})
