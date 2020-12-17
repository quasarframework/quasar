import { h, defineComponent, Transition } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import ValidateMixin from '../../mixins/validate.js'
import DarkMixin from '../../mixins/dark.js'
import SplitAttrsMixin from '../../mixins/split-attrs.js'

import { hSlot } from '../../utils/render.js'
import uid from '../../utils/uid.js'
import { stop, prevent, stopAndPrevent } from '../../utils/event.js'

function getTargetUid (val) {
  return val === void 0 ? `f_${uid()}` : val
}

export default defineComponent({
  name: 'QField',

  mixins: [ DarkMixin, ValidateMixin, SplitAttrsMixin ],

  inheritAttrs: false,

  props: {
    label: String,
    stackLabel: Boolean,
    hint: String,
    hideHint: Boolean,
    prefix: String,
    suffix: String,

    labelColor: String,
    color: String,
    bgColor: String,

    filled: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    standout: [ Boolean, String ],

    square: Boolean,

    loading: Boolean,

    labelSlot: Boolean,

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

    for: String,

    maxlength: [ Number, String ],
    maxValues: [ Number, String ] // used internally by QSelect
  },

  emits: [ 'update:modelValue', 'clear', 'focus', 'blur', 'popup-show', 'popup-hide' ],

  data () {
    return {
      focused: false,
      targetUid: getTargetUid(this.for),

      // used internally by validation for QInput
      // or menu handling for QSelect
      innerLoading: false
    }
  },

  watch: {
    for (val) {
      // don't transform targetUid into a computed
      // prop as it will break SSR
      this.targetUid = getTargetUid(val)
    }
  },

  computed: {
    // gets extended
    fieldClass () {},

    editable () {
      return this.disable !== true && this.readonly !== true
    },

    hasValue () {
      const value = this.field.getControl === void 0 ? this.modelValue : this.innerValue

      return value !== void 0 &&
        value !== null &&
        ('' + value).length > 0
    },

    computedCounter () {
      if (this.counter !== false) {
        const len = typeof this.modelValue === 'string' || typeof this.modelValue === 'number'
          ? ('' + this.modelValue).length
          : (Array.isArray(this.modelValue) === true ? this.modelValue.length : 0)

        const max = this.maxlength !== void 0
          ? this.maxlength
          : this.maxValues

        return len + (max !== void 0 ? ' / ' + max : '')
      }
    },

    floatingLabel () {
      return this.stackLabel === true ||
        this.focused === true ||
        (
          this.$data.inputValue !== void 0 && this.hideSelected === true
            ? this.inputValue.length > 0
            : this.hasValue === true
        ) ||
        (
          this.$props.hasOwnProperty('displayValue') === true &&
          this.displayValue !== void 0 &&
          this.displayValue !== null &&
          ('' + this.displayValue).length > 0
        )
    },

    shouldRenderBottom () {
      return this.bottomSlots === true ||
        this.hint !== void 0 ||
        this.hasRules === true ||
        this.counter === true ||
        this.error !== null
    },

    classes () {
      return `q-field row no-wrap items-start q-field--${this.styleType}` +
        (this.fieldClass !== void 0 ? ` ${this.fieldClass}` : '') +
        (this.rounded === true ? ' q-field--rounded' : '') +
        (this.square === true ? ' q-field--square' : '') +
        (this.floatingLabel === true ? ' q-field--float' : '') +
        (this.hasLabel === true ? ' q-field--labeled' : '') +
        (this.dense === true ? ' q-field--dense' : '') +
        (this.itemAligned === true ? ' q-field--item-aligned q-item-type' : '') +
        (this.isDark === true ? ' q-field--dark' : '') +
        (this.field.getControl === void 0 ? ' q-field--auto-height' : '') +
        (this.focused === true ? ' q-field--focused' : '') +
        (this.hasError === true ? ' q-field--error' : '') +
        (this.hasError === true || this.focused === true ? ' q-field--highlighted' : '') +
        (this.hideBottomSpace !== true && this.shouldRenderBottom === true ? ' q-field--with-bottom' : '') +
        (this.disable === true ? ' q-field--disabled' : (this.readonly === true ? ' q-field--readonly' : ''))
    },

    styleType () {
      if (this.filled === true) { return 'filled' }
      if (this.outlined === true) { return 'outlined' }
      if (this.borderless === true) { return 'borderless' }
      if (this.standout) { return 'standout' }
      return 'standard'
    },

    contentClass () {
      return 'q-field__control relative-position row no-wrap' +
        (this.bgColor !== void 0 ? ` bg-${this.bgColor}` : '') +
        (
          this.hasError === true
            ? ' text-negative'
            : (
                typeof this.standout === 'string' && this.standout.length > 0 && this.focused === true
                  ? ` ${this.standout}`
                  : (this.color !== void 0 ? ` text-${this.color}` : '')
              )
        )
    },

    hasLabel () {
      return this.labelSlot === true || this.label !== void 0
    },

    labelClass () {
      return 'q-field__label no-pointer-events absolute ellipsis' +
        (this.labelColor !== void 0 && this.hasError !== true ? ` text-${this.labelColor}` : '')
    },

    controlSlotScope () {
      return {
        id: this.targetUid,
        field: this.$el,
        editable: this.editable,
        focused: this.focused,
        floatingLabel: this.floatingLabel,
        modelValue: this.modelValue,
        emitValue: this.__emitValue
      }
    },

    attrs () {
      const attrs = {
        for: this.targetUid
      }

      if (this.disable === true) {
        attrs[ 'aria-disabled' ] = 'true'
      }
      else if (this.readonly === true) {
        attrs[ 'aria-readonly' ] = 'true'
      }

      return attrs
    }
  },

  methods: {
    focus () {
      if (this.showPopup !== void 0) {
        this.showPopup()
        return
      }

      this.__focus()
    },

    blur () {
      const el = document.activeElement
      // IE can have null document.activeElement
      if (el !== null && this.$el.contains(el)) {
        el.blur()
      }
    },

    __focus () {
      const el = document.activeElement
      let target = this.$refs.target
      // IE can have null document.activeElement
      if (target && (el === null || el.id !== this.targetUid)) {
        target.hasAttribute('tabindex') === true || (target = target.querySelector('[tabindex]'))
        target && target !== el && target.focus()
      }
    },

    __getContent () {
      const node = []

      this.$slots.prepend !== void 0 && node.push(
        h('div', {
          class: 'q-field__prepend q-field__marginal row no-wrap items-center',
          key: 'prepend',
          ...this.slotsEvents
        }, this.$slots.prepend())
      )

      node.push(
        h('div', {
          class: 'q-field__control-container col relative-position row no-wrap q-anchor--skip'
        }, this.__getControlContainer())
      )

      this.$slots.append !== void 0 && node.push(
        h('div', {
          class: 'q-field__append q-field__marginal row no-wrap items-center',
          key: 'append',
          ...this.slotsEvents
        }, this.$slots.append())
      )

      this.hasError === true && this.noErrorIcon === false && node.push(
        this.__getInnerAppendNode('error', [
          h(QIcon, { name: this.$q.iconSet.field.error, color: 'negative' })
        ])
      )

      if (this.loading === true || this.innerLoading === true) {
        node.push(
          this.__getInnerAppendNode(
            'inner-loading-append',
            this.$slots.loading !== void 0
              ? this.$slots.loading()
              : [h(QSpinner, { color: this.color })]
          )
        )
      }
      else if (this.clearable === true && this.hasValue === true && this.editable === true) {
        node.push(
          this.__getInnerAppendNode('inner-clearable-append', [
            h(QIcon, {
              class: 'q-field__focusable-action',
              tag: 'button',
              name: this.clearIcon || this.$q.iconSet.field.clear,
              tabindex: 0,
              type: 'button',
              ...this.clearableEvents
            })
          ])
        )
      }

      this.field.getInnerAppend !== void 0 && node.push(
        this.__getInnerAppendNode('inner-append', this.field.getInnerAppend())
      )

      this.field.getControlChild !== void 0 && node.push(
        this.field.getControlChild()
      )

      return node
    },

    __getControlContainer () {
      const node = []

      this.prefix !== void 0 && this.prefix !== null && node.push(
        h('div', {
          class: 'q-field__prefix no-pointer-events row items-center'
        }, this.prefix)
      )

      if (this.field.getShadowControl !== void 0 && this.hasShadow === true) {
        node.push(
          this.field.getShadowControl()
        )
      }

      if (this.field.getControl !== void 0) {
        node.push(this.field.getControl())
      }
      // internal usage only:
      else if (this.$slots.rawControl !== void 0) {
        node.push(this.$slots.rawControl())
      }
      else if (this.$slots.control !== void 0) {
        node.push(
          h('div', {
            ref: 'target',
            class: 'q-field__native row',
            ...this.qAttrs,
            'data-autofocus': this.autofocus
          }, this.$slots.control(this.controlSlotScope))
        )
      }

      this.hasLabel === true && node.push(
        h('div', {
          class: this.labelClass
        }, hSlot(this, 'label', this.label))
      )

      this.suffix !== void 0 && this.suffix !== null && node.push(
        h('div', {
          class: 'q-field__suffix no-pointer-events row items-center'
        }, this.suffix)
      )

      return node.concat(hSlot(this, 'default'))
    },

    __getBottom () {
      let msg, key

      if (this.hasError === true) {
        if (this.computedErrorMessage !== void 0) {
          msg = [h('div', this.computedErrorMessage)]
          key = this.computedErrorMessage
        }
        else {
          msg = hSlot(this, 'error')
          key = 'q--slot-error'
        }
      }
      else if (this.hideHint !== true || this.focused === true) {
        if (this.hint !== void 0) {
          msg = [h('div', this.hint)]
          key = this.hint
        }
        else {
          msg = hSlot(this, 'hint')
          key = 'q--slot-hint'
        }
      }

      const hasCounter = this.counter === true || this.$slots.counter !== void 0

      if (this.hideBottomSpace === true && hasCounter === false && msg === void 0) {
        return
      }

      const main = h('div', {
        key,
        class: 'q-field__messages col'
      }, msg)

      return h('div', {
        class: 'q-field__bottom row items-start q-field__bottom--' +
          (this.hideBottomSpace !== true ? 'animated' : 'stale')
      }, [
        this.hideBottomSpace === true
          ? main
          : h(Transition, { name: 'q-transition--field-message' }, () => main),

        hasCounter === true
          ? h('div', {
              class: 'q-field__counter'
            }, this.$slots.counter !== void 0 ? this.$slots.counter() : this.computedCounter)
          : null
      ])
    },

    __getInnerAppendNode (key, content) {
      return content === null
        ? null
        : h('div', {
          key,
          class: 'q-field__append q-field__marginal row no-wrap items-center q-anchor--skip'
        }, content)
    },

    __onControlPopupShow (e) {
      e !== void 0 && stop(e)
      this.$emit('popup-show', e)
      this.hasPopupOpen = true
      this.__onControlFocusin(e)
    },

    __onControlPopupHide (e) {
      e !== void 0 && stop(e)
      this.$emit('popup-hide', e)
      this.hasPopupOpen = false
      this.__onControlFocusout(e)
    },

    __onControlFocusin (e) {
      if (this.editable === true && this.focused === false) {
        this.focused = true
        this.$emit('focus', e)
      }
    },

    __onControlFocusout (e, then) {
      clearTimeout(this.focusoutTimer)
      this.focusoutTimer = setTimeout(() => {
        if (
          document.hasFocus() === true && (
            this.hasPopupOpen === true ||
            this.$refs === void 0 ||
            !this.$refs.control ||
            this.$refs.control.contains(document.activeElement) !== false
          )
        ) {
          return
        }

        if (this.focused === true) {
          this.focused = false
          this.$emit('blur', e)
        }

        then !== void 0 && then()
      })
    },

    __clearValue (e) {
      // prevent activating the field but keep focus on desktop
      stopAndPrevent(e)

      if (this.$q.platform.is.mobile !== true) {
        const el = this.$refs.target || this.$el
        el.focus()
      }
      else if (this.$el.contains(document.activeElement) === true) {
        document.activeElement.blur()
      }

      if (this.type === 'file') {
        // do not let focus be triggered
        // as it will make the native file dialog
        // appear for another selection
        this.$refs.input.value = null
      }

      this.$emit('update:modelValue', null)
      this.$emit('clear', this.modelValue)

      this.$nextTick(() => {
        this.resetValidation()

        if (this.lazyRules !== 'ondemand' && this.$q.platform.is.mobile !== true) {
          this.isDirty = false
        }
      })
    },

    __emitValue (value) {
      this.$emit('update:modelValue', value)
    }
  },

  render () {
    this.field.onPreRender !== void 0 && this.field.onPreRender()
    this.field.onPostRender !== void 0 && this.$nextTick(this.field.onPostRender)

    return h('label', {
      class: [
        this.classes,
        this.$attrs.class
      ],
      style: this.$attrs.style,
      ...this.attrs
    }, [
      this.$slots.before !== void 0
        ? h('div', {
            class: 'q-field__before q-field__marginal row no-wrap items-center',
            ...this.slotsEvents
          }, this.$slots.before())
        : null,

      h('div', {
        class: 'q-field__inner relative-position col self-stretch column justify-center'
      }, [
        h('div', {
          ref: 'control',
          class: this.contentClass,
          tabindex: -1,
          ...this.controlEvents
        }, this.__getContent()),

        this.shouldRenderBottom === true
          ? this.__getBottom()
          : null
      ]),

      this.$slots.after !== void 0
        ? h('div', {
            class: 'q-field__after q-field__marginal row no-wrap items-center',
            ...this.slotsEvents
          }, this.$slots.after())
        : null
    ])
  },

  created () {
    this.field = {}

    this.slotsEvents = { onClick: prevent }
    this.clearableEvents = { onClick: this.__clearValue }
    this.controlEvents = this.__getControlEvents !== void 0
      ? this.__getControlEvents()
      : {
          onFocusin: this.__onControlFocusin,
          onFocusout: this.__onControlFocusout
        }
  },

  mounted () {
    if (isRuntimeSsrPreHydration === true && this.for === void 0) {
      this.targetUid = getTargetUid()
    }

    this.autofocus === true && this.focus()
  },

  beforeUnmount () {
    clearTimeout(this.focusoutTimer)
  }
})
