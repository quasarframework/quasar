
  <!--
    One Size Fits All!
    ==================
    NB: This layout uses (more-or-less) the Quasar standards for HTML & CSS while accommodating all permutations of labels, icons, inputs & list-items.

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
  <div v-else class="item multiple-lines qf" :class='css_Field' >
  <!--     <pre>{{ style_Label }} </pre> -->
    <i v-if='draw_Icon' class="item-primary qf-icon" >{{ icon }}</i>
    <div class="item-content qf-content" :class='css_FieldContent'>
      <label v-if='txt_Label' :for='inputId' class='item-label qf-label' :style='style_Label'>{{ txt_Label }}:</label>
      <div ref="inner" class="qf-inner" :class='css_FieldInner' :style='style_FieldInner' >
        <slot></slot>
        <div class='qf-swoosh'></div>
        <label v-if='txt_Float' class='qf-label' :class='css_Float' :for='inputId'>{{ txt_Float }}</label>
        <span v-if='draw_Counter' class="qf-counter">{{ txt_Counter }}</span>
        <span v-if='hint' class="qf-hint">{{ txt_Hint }}</span>
        <span v-if='draw_Validate' class="qf-validate-msg">{{ txt_ValidateMsg }}</span>
      </div>
    </div>
    <i v-if='draw_Icon2' class="item-secondary qf-icon" >{{ icon2 }}</i>
  </div>
</template>

<script>
/* eslint-disable */
  /**
    TODO:
    - React to changes in input attributes: disabled/readonly/value, etc.
    - iOS styles
    - multiple validation messages
    - width handling

  */
import { Utils } from 'quasar'
export default {
  name: 'q-floating-label',
  props: {
    label: {
      type: String
    },
    layout: {
      type: String, // 'floating' | 'stacked' | 'inplace' | 'placeholder' | 'inline' | +/'list-item' | +/custom
      default: 'floating'
    },
    float: {
      type: String
    },
    floatLayout: {
      type: String, // 'floating' | 'stacked' | 'inplace' | 'placeholder' | 'inline' | +/'list-item' | +/custom
      default: 'inplace'
    },
    hint: {
      type: String
    },
    counter: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: null // default=null='shrink' | grow' | '#px' | '#%'
    },
    align: {
      type: String,
      default: null // default=null='left' | 'right' | 'center'
    },
    inlineWidth: {
      type: String,
      default: null // default=null='shrink' | grow' | '#px' | '#%'
    },
    inlineAlign: {
      type: String,
      default: null // default=null='left' | 'right' | 'center'
    },
    icon: {
      type: String
    },
    iconInverse: {
      type: Boolean
    },
    icon2: {
      type: String
    },
    maxlength: {
      type: Number
    },
    validate: {
      type: [String, Boolean], // false (default) | 'immediate' | 'eager' true | 'lazy' | 'submit' (TBA)
      default: false
    },
    validateMsg: {
      // TODO: more than 1 msg!
      type: String
    }
  },
  data () {
    return {
      // prop local aliases
      myLabel: this.label,
      myFloat: this.float,
      myLayout: this.layout,
      // derived properties
      input: null,
      inputType: null,
      inputId: null,
      isTextInput: null,
      isInline: null,
      maxChars: null,
      // field state
      state: {
        hasFocus: null,
        hasTouched: null,
        hasValue: null,
        hasInvalid: null,
        hasTooLong: null,
        hasReadOnly: null,
        hasDisabled: null,
        hasRequired: null,
        currentChars: null
      }
    }
  },
  computed: {
    // prop local aliases
    myMaxlength () {
      // If TEXT input, return...
      // 1. component "maxlength" prop, or  (NB: User-entry UNRESTRICTED)
      // 2. input 'maxlength' attr          (NB: User-entry LIMITED to 'maxlength')
      // otherwise return 0 (no maxlength)
      return !this.isTextInput ? 0 : this.maxlength ? parseInt(this.maxlength, 10) : this.input.hasAttribute('maxlength') ? this.input.maxlength : 0
    },
    myValidate () {
      // If TEXT input, convert TRUE => 'eager', return 'immediate' | 'eager' | 'lazy' | 'form' (TBA) | false
      return !this.isTextInput ? false : this.validate === true ? 'eager' : this.validate ? this.validate : false
    },
    // view rules
    draw_Counter () {
      return !!(this.counter && this.myMaxlength)
    },
    txt_Counter () {
      return this.state.currentChars + ' / ' + this.myMaxlength
    },
    draw_Icon () {
      return !!this.icon
    },
    draw_Icon2 () {
      return !!this.icon2
    },
    txt_Label () {
      return this.myLabel
    },
    txt_Float () {
      return this.myFloat
    },
    txt_Hint () {
      return this.hint
    },
    css_Float () {
      // Explanation:
      // 'float.qf-float' in this context is the floating label when used as secondary text content - NOT a 'label'
      // Instead, the job of being a Label falls to the inline 'label.item-label, leaving this wee floaty thing free for other (useless?) fancy stuff.
      // Invoked by providing 2 minimum props:  layout='inline' (kicks in the inline label) AND float='some extra message'.
      // Default 'float-layout' is 'inplace', but others can be specified e.g. 'floating', 'placeholder', 'stacked'.
      // float-layout='inline' is illegal as 'inline' layout is already occupied by the mainm label's layout.
      //
      return this.float ? 'qf-float' : 'qf-float-label'
    },
    draw_Validate () {
      return this.validate
    },
    txt_ValidateMsg () {
      return this.validateMsg || 'Please enter a valid value.'
      // TODO: Allow msg update / multiple msgs / `vee-validate` integration?
    },
    css_Field () {
      let
        s = this.state,
        css =
        {
          ['qf-layout-' + this.myLayout]: true,
          'qf-dense': this.dense,
          'qf-active': s.hasFocus || s.hasValue || s.hasReadOnly,
          // 'qf-touched': s.hasTouched, // Why is this needed in css?
          'qf-focus': s.hasFocus,
          'qf-value': s.hasValue,
          'qf-invalid': this.validate && s.hasInvalid,
          'qf-invalid-too-long': s.hasTooLong,
          'qf-read-only': s.hasReadOnly,
          'qf-disabled': s.hasDisabled,
          'qf-required': s.hasRequired
        }
      return css
    },
    css_FieldContent () {
      return this.icon2 ? 'has-secondary' : ''
    },
    style_FieldInner () {
      // shrink / grow / size <input> container
      return this.calcWidthStyles(this.width, this.align)
    },
    css_FieldInner () {
      // if container defines a size then <input> with match container. (If not, container will match <input> so leave it alone.)
      return (this.width && this.width != 'shrink') ? 'qf-grow-input' : ''
    },
    style_Label () {
      // shrink / grow / size inline <label.item-label>
      return this.calcWidthStyles(this.labelWidth, this.labelAlign)
    }
  },
  methods: {
    // Utils
    calcWidthStyles (width, align) {
      let style = {}
      if (width === 'grow') {
        style['flex-grow'] = '1'
      } else if (width && width != 'shrink') {
        style['width'] = width
      } else if (width) {
        style['flex-shrink'] = '1'
      }
      if (align) {
        style['text-align'] = align
      }
      return style
    },
    // Events
    __onFocus (e) {
      this.state.hasFocus = true
    },
    __onBlur (e) {
      this.state.hasFocus = false
      this.state.hasTouched = true
      if (this.myValidate === 'lazy') {
        this.__updateState_validity()
      }
    },
    __onInput (e) {
      this.state.hasValue = this.input.value ? true : false
      this.hasTouched = true
      if (this.myValidate === 'eager') {
        this.__updateState_validity()
      }
      if (this.draw_Counter) {
        this.__updateState_counter()
      }
    },
    // State maintenance
    __initState () {
      // TODO: Enable change after render...
      this.state.hasRequired = this.input.required
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
    },
    __updateState_counter () {
      this.state.currentChars = this.input.value.length
      this.state.hasTooLong = this.state.currentChars > this.myMaxlength
    },
    __updateState_validity () {
      // TODO: input.validity: {
      //   valid,
      //   badInput, customError, patternMismatch, rangeOverflow, rangeUnderflow, stepMismatch, tooLong, tooShort,typeMismatch, valueMissing
      this.state.hasInvalid = !this.input.validity.valid && (this.state.hasValue || this.state.hasTouched)
    }
  },
  mounted () {

    // Sanitise input control (Type, Id, etc.)
    //
    this.input = this.$refs.inner.firstChild // this.$el.querySelector('input, textarea')
    if (!this.input) {
      throw new Error('<q-floating-label> is missing the required input element/component.')
      return
    }
    if (['textarea','text','input','password','datetime','email','number','search','time','week','date','datetime-local','month','tel','url'].includes(this.input.type))
    {
      this.isTextInput = true
      this.inputType = this.input.type
      this.input.checkValidity()
      this.__updateState_counter()
      if (this.validate === 'immediate') {
        this.__updateState_validity()
      }
    } else {
      this.isTextInput = false
    }
    if (this.input.id) {
      this.inputId = this.input.id
    } else {
      this.inputId = Utils.uid()
      this.input.id = this.inputId
    }


    // Layout (Floating labels vs. Inline Label + opt. 'float-layout')
    //
    if (!this.layout || this.layout === 'inline') {
      // item-label is main Label, float functions as optional msg.
      this.layout = 'inline' //
      this.isInline = true
      this.myLabel = this.label
      this.myLayout = this.float ? this.floatLayout : this.layout
      this.myFloat = this.float ? this.float : null
    } else {
      // float functions as main Label
      this.isInline = false
      this.myLabel = null
      this.myLayout = this.layout
      this.myFloat = this.label
    }

    // this.myHint
    this.myHint = this.hint

    // this.myCounter
    // this.maxChars

    // add events
    if (this.isTextInput) {
      this.$el.addEventListener('focus', this.__onFocus, true)
      this.$el.addEventListener('blur', this.__onBlur, true)
      this.$el.addEventListener('input', this.__onInput, true)
      this.__onInput()
      this.__initState()
    } else {
      // TODO: Handle non-textual components properly!!
      this.$el.addEventListener('focusin', this.__onFocus, true)
      this.$el.addEventListener('focusout', this.__onBlur, true)
    }
  },
  beforeDestroy () {
    // remove events
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

