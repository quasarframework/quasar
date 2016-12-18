
  <!--
    One Size Fits All!
    ==================
    N.B. This layout uses (more-or-less) the Quasar standards for HTML & CSS while accommodating all permutations of labels, icons, inputs & list-items.

    However, it will render up to two extra containing <div>s every time, even though these are only required for firlds with one or more of these options:
      - icon (needs outer div A)
      - lineline-label (needs outer div A)
      - list-item (needs outer div B)

    TODO: Divert to leaner alternative HTML structures where possible

    <v-if="!isListItem">
      // TODO

    <v-if="isListItem">
      // Below...
  -->

<template>
  <div class="item multiple-lines q-field" :class='css_Field' :style='style_Field' >
    <i v-if='draw_Icon' class="item-primary q-field-icon" >{{ icon }}</i>
    <div class="item-content q-field-content" :class='css_FieldContent'>
      <label v-if='txt_Label' class='item-label' :style='style_InlineLabel'>{{ txt_Label }}:</label>
      <div ref="inner" class="q-field-inner" :style='style_FieldInner'>
        <slot></slot>
        <label v-if='txt_Float'>{{ txt_Float }}</label>
        <div class='q-swash'></div>
        <span v-if='draw_Validate'>{{ txt_ValidateMsg }}</span>
      </div>
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
  name: 'q-floating-label',
  props: {
    label: {
      type: String
    },
    layout: {
      type: String, // 'floating' | 'stacked' | 'placeholder' | 'inline' | +/'list-item' | +/custom
      default: 'floating'
    },
    float: {
      type: String
    },
    floatLayout: {
      type: String, // 'floating' | 'stacked' | 'placeholder' | 'inline' | +/'list-item' | +/custom
      default: 'placeholder'
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
      __label: this.label,
      __float: this.float,
      __layout: this.layout,
      input: null,
      inputType: null,
      isTextInput: null,
      isListItem: null,
      isInline: null,
      isFloat: null,
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
    txt_Label () {
      return this.__label
    },
    txt_Float () {
      return this.__float
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
        {
          ['q-field-layout-' + this.layout]: true,
          ['q-field-' + (this.isListItem ? 'listed' : 'unlisted')]: true,
          'q-field-icon': this.icon,
          'q-field-dense': this.dense,
          'q-field-active': s.hasFocus || s.hasValue || s.hasReadOnly,
          'q-field-touched': s.hasTouched, // Why needed in css?
          'q-field-focus': s.hasFocus,
          'q-field-value': s.hasValue, // Why needed in css?
          'q-field-invalid': s.hasInvalid,
          'q-field-read-only': s.hasReadOnly,
          'q-field-disabled': s.hasDisabled,
          'q-field-required': s.hasRequired
        }
      return css
    },
    style_Field () {
      let style = {}
      if (this.width && this.width != 'shrink') {
        style['width'] = (this.width === 'grow') ? '100%' : this.width
      }
      return style
    },
    css_FieldContent () {
      return this.isInline ? ['row', 'items-start', 'wrap'] : []
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
    // TODO: Nexttick needed here?

    // this.isListItem
    if (!this.$el.matches) {
      alert('browser doesn\'t like $el.matches!')
      this.isListItem = true
    } else {
      this.isListItem = this.$el.matches('div.list > div.q-field')
    }

    // this.isInline
    // this.__label
    // this.__float
    // this.__layout
    if (this.layout === 'inline') {
      this.isInline = true
      this.__label = this.label
      this.__layout = this.float ? this.floatLayout : null
      this.__float = this.float ? this.float : null
    } else {
      this.isInline = false
      this.__label = null
      this.__layout = this.layout
      this.__float = this.label
    }


    // this.input
    // this.inputType
    // this.isTextInput
    this.input = this.$refs.inner.firstChild // this.$el.querySelector('input, textarea')
    if (!this.input) {
      throw new Error('<q-floating-label> is missing the required input element/component.')
      return
    }
    if (['text', 'textarea'].includes(this.input.type)) {
      this.isTextInput = true
      this.inputType = this.input.type
    } else {
      this.isTextInput = false
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

