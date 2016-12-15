<template>
  <div
    class='fl-container'
    :class='css_Container'
    :style='style_Container'
  >
    <label v-if="layout === 'inline'">{{ label }}</label>
    <div class='fl-inner'>
      <slot></slot>
      <label>{{ label }}</label>
      <div></div>
      <span v-if='drawValidation'>{{ txt_ValidationMsg }}</span>
      <i v-if='drawIcon'>{{ icon }}</i>
    </div>
  </div>
</template>

<script>
// TODO:
/* eslint-disable */
// - React to changes in input attributes: disabled/readonly/value, etc.
// - iOS styles
// - multiple validation messages
// - inline layout
// - width handling?
//
export default {
  name: 'q-float-label',
  props: {
    label: {
      type: String,
      required: true
    },
    layout: {
      type: String, // 'floating' | 'stacked' | 'inside' | inline' | 'nolabel' | custom
      default: 'floating'
    },
    dense: {
      type: Boolean,
      default: false
    },
    width: {
      type: String
    },
    icon: {
      type: String
    },
    validate: {
      type: Boolean,
      default: false
    },
    validateMsg: {
      type: String
    },
    validateLazy: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // input
      input: null,
      inputType: null,
      // layout
      layoutCss:
        'fl-layout-' + this.layout
        + (this.icon ? ' fl-icon' : '')
        + (this.dense ? ' fl-dense' : ''),
      drawIcon: this.icon,
      // validation
      txt_ValidationMsg: this.validateMsg || 'Please enter a valid value.',
      drawValidation: this.validate,
      // state
      state: {
        hasFocus: false,
        hasTouched: false,
        hasValue: false,
        hasInvalid: false,
        hasReadOnly: false,
        hasDisabled: false
      }
    }
  },
  computed: {
    style_Container () {
      let style =
      {
        'width': (this.width === 'max' || this.width === 'full-width') ? '100%' : (this.width === 'min') ? '' : this.width
      }
      return style
    },
    css_Container () {
      let
        s = this.state,
        css =
        [
          [this.layoutCss],
          {
            'fl-active': s.hasFocus || s.hasValue || s.hasReadOnly,
            'fl-touched': s.hasTouched,
            'fl-focus': s.hasFocus,
            'fl-value': s.hasValue,
            'fl-invalid': s.hasInvalid,
            'fl-read-only': s.hasReadOnly,
            'fl-disabled': s.hasDisabled
          }
        ]
      return css
    }
  },
  methods: {
    __onFocus (e) {
      this.state.hasFocus = true
    },
    __onBlur (e) {
      this.state.hasFocus = false
      this.state.touched = true
      this.__updateInvalid()
    },
    __onInput (e) {
      this.state.hasValue = this.input.value ? true : false
      this.touched = true
      if (!this.validateLazy) {
        this.__updateInvalid()
      }
    },
    __updateInvalid () {
      this.state.hasInvalid = !this.input.validity.valid && (this.state.hasValue || this.state.touched)
    },
    __update () {
      // TODO: Enable change after render...
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
    }
  },
  mounted () {
      this.input = this.$el.querySelector('input, textarea')
      if (!this.input) {
        throw new Error('<q-floating-label> is missing the required input/textarea element.')
        return
      }
      this.inputType = this.input.type
      this.$el.addEventListener('focus', this.__onFocus, true)
      this.$el.addEventListener('blur', this.__onBlur, true)
      this.$el.addEventListener('input', this.__onInput, true)
      this.__onInput()
      this.__update()
  },
  beforeDestroy () {
      this.$el.removeEventListener('focus', this.__onFocus, true)
      this.$el.removeEventListener('blur', this.__onBlur, true)
      this.$el.removeEventListener('input', this.__onInput, true)
  }
}
</script>

