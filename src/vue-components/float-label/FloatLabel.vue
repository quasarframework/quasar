<template>

  <!--


  // TEMPLATE:
  <div class="item q-field-container q-field-layout-XXXX q-field-focus q-field-active">

    <i class="item-primary">edit</i>
    <div class="item-content">
      <label>Inline Label</label>
      <div class="q-field-layout">
        <input required="required" class="full-width">
        <label>Floating Label</label>
      </div>

    </div>

  </div>

 -->

  <div
    class="item q-field"
    :class='css_Field'
    :style='style_Field'
  >
    <i v-if='draw_Icon' class="item-primary" >{{ icon }}</i>
    <label v-if='draw_InlineLabel' :style='style_InlineLabel'>{{ label }}:</label>
    <div ref="inner" class="q-field-inner" :style='style_FieldInner'>
      <slot></slot>
      <label v-if='draw_FloatingLabel'>{{ label }}</label>
      <div class='q-swish'></div>
      <span v-if='draw_Validate'>{{ txt_ValidateMsg }}</span>
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
  name: 'q-field-inner',
  props: {
    label: {
      type: String
    },
    layout: {
      type: String, // 'floating' | 'stacked' | 'placeholder' | 'inline' | +/'list-item' | +/custom
      default: 'floating'
    },
    dense: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'shrink' // 'grow' | 'shrink' | '#px' | '#%'
    },
    labelWidth: {
      type: String,
      default: 'shrink' // 'grow' | 'shrink' | '#px' | '#%' (NB: Only with layout='inline')
    },
    labelAlign: {
      type: String,
      default: 'left' // 'left' | 'right'
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
      input: null,
      inputType: null,
      isTextInput: null,
      isInline: this.layout === 'inline',
      state: {
        hasFocus: false,
        hasTouched: false,
        hasValue: false,
        hasInvalid: false,
        hasReadOnly: false,
        hasDisabled: false,
        hasRequired: false
      }
    }
  },
  computed: {
    draw_Icon () {
      return !!this.icon
    },
    draw_InlineLabel () {
      return !!this.isInline
    },
    draw_FloatingLabel () {
      return !this.isInline
    },
    draw_Validate () {
      return this.validate
    },
    txt_ValidateMsg () {
      return this.validateMsg || 'Please enter a valid value.'
      // TODO: Allow msg update / multiple msgs / `vee-validate` integration
    },
    css_Field () {
      let
        s = this.state,
        css =
        [
          ['q-field-layout-' + this.layout],
          {
            'q-field-icon': this.icon,
            'q-field-dense': this.dense,
            'q-field-active': s.hasFocus || s.hasValue || s.hasReadOnly,
            'q-field-touched': s.hasTouched,
            'q-field-focus': s.hasFocus,
            'q-field-value': s.hasValue,
            'q-field-invalid': s.hasInvalid,
            'q-field-read-only': s.hasReadOnly,
            'q-field-disabled': s.hasDisabled,
            'q-field-required': s.hasRequired
          }
        ]
      return css
    },
    style_Field () {
      let style = {}
      if (this.width && this.width != 'shrink') {
        style['width'] = (this.width === 'grow') ? '100%' : this.width
      }
      return style
    },
    style_FieldInner () {
      let style = {}
      if (!this.isInline || this.labelWidth !== 'grow') {
        style['flex-grow'] = '1'
      }
      return style
    },
    style_InlineLabel () {
      let style = {}
      if (this.labelWidth === 'grow') {
        style['flex-grow'] = '1'
      } else if (this.labelWidth === 'shrink') {
        style['flex-shrink'] = '1'
      } else if (this.labelWidth) {
        style['width'] = this.labelWidth
      }
      if (this.labelAlign === 'right') {
        style['text-align'] = 'right'
      }
      return style
    }
  },
  methods: {
    __onFocus (e) {
      console.log('focus')
      this.state.hasFocus = true
    },
    __onBlur (e) {
      this.state.hasFocus = false
      this.state.touched = true
      if (this.isTextInput) {
        this.__updateInvalid()
      }
    },
    __onInput (e) {
      this.state.hasValue = this.input.value ? true : false
      this.touched = true
      if (!this.validateLazy) {
        this.__updateInvalid()
      }
    },
    __updateInvalid () {
      // TODO: Cater for >1 of ...
      // input.validity = {
      //   badInput
      //   customError
      //   patternMismatch
      //   rangeOverflow
      //   rangeUnderflow
      //   stepMismatch
      //   tooLong
      //   tooShort
      //   typeMismatch
      //   valid
      //   valueMissing
      //   }
      this.state.hasInvalid = !this.input.validity.valid && (this.state.hasValue || this.state.touched)
    },
    __update () {
      // TODO: Enable change after render...
      this.state.hasRequired = this.input.required
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
    }
  },
  mounted () {
      // this.input = this.$el.querySelector('input, textarea')
      this.input = this.$refs.inner.firstChild
      if (!this.input) {
        throw new Error('<q-floating-label> is missing the required input element/component.')
        return
      }
      if (['text', 'textarea'].includes(this.input.type)) {
        this.isTextInput = true
        this.inputType = this.input.type
      } else {
        this.isTextInput = false
        this.inputTYpe = ''
      }
      if (this.inputType) {
        this.$el.addEventListener('focus', this.__onFocus, true)
        this.$el.addEventListener('blur', this.__onBlur, true)
        this.$el.addEventListener('input', this.__onInput, true)
        this.__onInput()
        this.__update()
      } else {
        // TODO: Handle components properly
        this.$el.addEventListener('focus', this.__onFocus, true)
        this.$el.addEventListener('blur', this.__onBlur, true)
      }
  },
  beforeDestroy () {
    if (this.inputType) {
      this.$el.removeEventListener('focus', this.__onFocus, true)
      this.$el.removeEventListener('blur', this.__onBlur, true)
      this.$el.removeEventListener('input', this.__onInput, true)
    } else {
      this.$el.removeEventListener('deactivate', this.__onFocus, true)
      this.$el.removeEventListener('deactivate', this.__onBlur, true)
    }
  }
}
</script>

