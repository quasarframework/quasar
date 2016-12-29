<template>
  <!--
      Target Only:
      HAD TO DISABLE for now: Can't find method of keeping events when then <input> element is completely replaced
  -->
  <!--  -->
  <!-- <div class='field field-target' :class='css_Field' :style="style_FieldTarget" ref="ref_FieldTarget">
    <label v-if='txt_Float' class='field-label' :class='css_Float' :for='inputId'>{{ txt_Float }}</label><slot></slot>
    <div class='field-swoosh'></div>
    <span v-if='draw_Counter' class="field-counter">{{ txt_Counter }}</span>
    <span v-if='txt_Hint' class="field-hint"><pre>{{ css_Field }}</pre></span>
    <span v-if='draw_Validate' class="field-validate-msg">{{ txt_ValidateMsg }}</span>
  </div> -->

  <!--
    One Size Fits All!
    ==================
    NB: This layout uses (more-or-less) the Quasar standards for HTML & CSS while accommodating all permutations of labels, icons, inputs & list-items.

    However, it will render up to two extra containing <div>s every time, even though these are only required for fields with one or more of these options:
      - icon or icon2 (needs outer div A)
      - lineline-label (needs outer div A)
      - list-item (needs outer div A & B)

    TODO: Divert to leaner alternative HTML structures where possible
  -->
  <div class='field' :class='css_Field'>
    <i v-if='draw_Icon' class="item-primary">{{ icon }}</i>
    <div class="item-content" :class='css_FieldContent'>
      <label v-if='txt_Label' :for='inputId' class='field-label item-label' :style='style_InlineLabel'>{{ txt_Label }}:</label>
      <div class="field-target" :class='css_FieldTarget' :style='style_FieldTarget' ref="ref_FieldTarget">
        <label v-if='txt_Float' class='field-label' :class='css_Float' :for='inputId'>{{ txt_Float }}</label><!-- DO NOT REMOVE!! --><slot></slot>
        <div class='field-swoosh'></div>
        <span v-if='draw_Counter' class="field-counter">{{ txt_Counter }}</span>
        <span v-if='txt_Hint' class="field-hint">{{ hint }}</span>
        <span v-if='draw_Validate' class="field-validate-msg">{{ txt_ValidateMsg }}</span>
      </div>
    </div>
    <i v-if='draw_Icon2' class="item-secondary" >{{ icon2 }}</i> <!-- css_Icon=[item-secondary] -->
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
let TEXT_INPUT_TYPES = ['textarea','text','input','password','datetime','email','number','search','time','week','date','datetime-local','month','tel','url']
export default {
    components: {
      'q-field-container': {
        render (createElement) {
          debugger
          return createElement(
            'div',
            [
              createElement('a', {
                attrs: {
                  name: 'test',
                  href: '#' + 'test'
                }
              }, this.$slots.default)
            ]
          )
        },
        data () {
          console.log('SUB SUB')
          return { a: 123}
        }
      }
    // ,
    // 'field-target': {

    // }
    },
    render: function (createElement) {
    // create kebabCase id
    debugger
    // var headingId = getChildrenTextContent(this.$slots.default)
    //   .toLowerCase()
    //   .replace(/\W+/g, '-')
    //   .replace(/(^\-|\-$)/g, '')
    return createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
  },
  name: 'q-field',
  props: {
    item: {
      type: Boolean
    },
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
      type: [String, Object]
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
      default: null // defaults to css | 'shrink' | grow' | '#px' | '#%'
    },
    labelWidth: {
      type: String,
      default: null // defaults to css | 'shrink' | grow' | '#px' | '#%'
    },
    targetWidth: {
      type: String,
      default: null // defaults to css | 'shrink' | grow' | '#px' | '#%'
    },
    align: {
      type: String,
      default: null // default=null='left' | 'right' | 'center'
    },
    labelAlign: {
      // todo: inline-align
      type: String,
      default: null // default=null='left' | 'right' | 'center'
    },
    icon: {
      // todo: field-icon
      type: String
    },
    iconInverse: {
      // todo: field-icon-inverse
      type: Boolean
    },
    icon2: {
      // todo: field-icon2
      type: String
    },
    maxlength: {
      type: Number
    },
    validate: {
      type: [String, Boolean], // false (default) | 'immediate' | 'eager' true | 'lazy' | 'submit' (TBA)
      default: false
    },
    validateImmediate: {
      type: Boolean, // false (default) | 'immediate' | 'eager' true | 'lazy' | 'submit' (TBA)
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
      isSingleInput: null,
      isInline: null,
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
      // 1. component "maxlength" prop, or  (NB: User-entry will be UNRESTRICTED)
      // 2. input 'maxlength' attr          (NB: User-entry will be LIMITED to 'maxlength' value)
      // otherwise 0 (no maxlength)
      return !this.isTextInput ? 0 : this.maxlength ? parseInt(this.maxlength, 10) : this.input.hasAttribute('maxlength') ? this.input.maxlength : 0
    },
    myValidate () {
      // If TEXT input, convert TRUE => 'eager', return 'immediate' | 'eager' | 'lazy' | 'form' (TBA) | false
      return !this.isTextInput ? false : this.validate === true ? 'eager' : this.validate ? this.validate : false
    },
    // Widths...
    // style_Field () {
    //   // shrink / grow / size <input> container
    //   return this.calcWidthStyles(this.width)
    // },
    style_FieldTarget () {
      // shrink / grow / size <input> container
      return this.calcWidthStyles(this.targetWidth, this.targetAlign)
    },
    style_InlineLabel () {
      // shrink / grow / size inline <label.item-label>
      return this.calcWidthStyles(this.labelWidth, this.labelAlign)
    },
    // Flags & CSS
    css_Field () {
      let
        s = this.state,
        css = {
          ['field-layout-' + this.myLayout]: true,
          [this.draw_TargetOnly ? 'target-only' : this.item ? 'item multiple-lines' : 'clean-item']: true,
          'field-dense': this.dense,
          'field-active': s.hasFocus || s.hasValue || s.hasReadOnly,
          'field-focus': s.hasFocus,
          'field-value': s.hasValue,
          // 'field-touched': s.hasTouched, // Why is this needed in css?
          'field-invalid': this.validate && s.hasInvalid,
          'field-invalid-too-long': s.hasTooLong,
          'field-read-only': s.hasReadOnly,
          'field-disabled': s.hasDisabled,
          'field-required': s.hasRequired
        }
      return css
    },
    css_FieldContent () {
      return this.icon2 ? 'has-secondary' : ''
    },
    css_FieldTarget () {
      // if container defines a size then <input> with match container. (If not, container will match <input> so leave it alone.)
      return this.targetWidth && this.targetWidth != 'shrink' ? 'field-grow-input' : ''
    },
    css_Float () {
      // Explanation:
      // 'float.field-float' in this context is the floating label when used as secondary text content - NOT a 'label'
      // Instead, the job of being a Label falls to the inline 'label.item-label, leaving this wee floaty thing free for other (useless?) fancy stuff.
      // Invoked by providing 2 minimum props:  layout='inline' (kicks in the inline label) AND float='some extra message'.
      // Default 'float-layout' is 'inplace', but others can be specified e.g. 'floating', 'placeholder', 'stacked'.
      // float-layout='inline' is illegal as 'inline' layout is already occupied by the mainm label's layout.
      //
      return this.float ? 'field-float' : 'field-float-label'
    },
    // View rules
    draw_TargetOnly () {
      return !this.item && !this.icon && !this.icon2 && !this.isInline
    },
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
      return this.hint // (this.draw_TargetOnly?'draw_TargetOnly=true':'draw_TargetOnly=false') + (this.draw_TargetOnly && !this.item ?' (pseudo)':'')  // this.hint
    },
    draw_Validate () {
      return this.validate
    },
    txt_ValidateMsg () {
      return this.validateMsg || 'Please enter a valid value.'
      // TODO: Allow msg update / multiple msgs / `vee-validate` integration?
    }
  },
  watch: {
    counter () {
      this.__updateState_counter()
    },
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
      this.__updateState_counter()
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
      this.state.hasTooLong = this.counter && this.myMaxlength && this.state.currentChars > this.myMaxlength ? true : false
    },
    __updateState_validity () {
      // TODO: input.validity: {
      //   valid,
      //   badInput, customError, patternMismatch, rangeOverflow, rangeUnderflow, stepMismatch, tooLong, tooShort,typeMismatch, valueMissing
      this.state.hasInvalid = !this.input.validity.valid && (this.state.hasValue || this.state.hasTouched)
    }
  },
  mounted () {

    // Identify input / content
    let elms = this.$slots.default.filter(vnode => { return !!vnode.tag })

    if (elms.length == 0) {
      this.isSingleInput = false
      console.warn('<q-field> missing content', this)
      return
    } if (elms.length == 1) {
      this.isSingleInput = true
      this.input = this.$refs.ref_FieldTarget.childNodes[1] // this.$el.querySelector('input, textarea')
    } else {
      // TODO: identify marked <input> among arbitrary user content, but for now...
      this.isSingleInput = false
    }
    if (!this.input) {
      console.warn('<q-field> missing target <input> or <textarea>.', this)
      // return
    }
    if (TEXT_INPUT_TYPES.includes(''+this.input.type)) {
      this.isTextInput = true
      this.inputType = this.input.type
      this.__updateState_counter()
      this.input.checkValidity()
      if (this.validateImmediate) {
        this.state.hasTouched = true
        this.__updateState_validity()
      }
    } else {
      // Custom
      // console.warn('<q-field> single target custom control. Found: ' + this.input.type, this)
      // return
    }

    // Id
    if (this.input.id) {
      this.inputId = this.input.id
    } else {
      this.inputId = Utils.uid()
      this.input.id = this.inputId
    }

    // Layout (Floating labels vs. Inline Label /'float-layout')
    if (!this.layout || this.layout === 'inline') {
      // item-label is main Label, float functions as optional msg.
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

    // add events
    if (this.isTextInput) {
      this.input.addEventListener('focus', this.__onFocus, true)
      this.input.addEventListener('blur', this.__onBlur, true)
      this.input.addEventListener('input', this.__onInput, true)
      this.__onInput()
      this.__initState()
    } else {
      // TODO: Handle non-textual components properly!!
      this.input.addEventListener('focusin', this.__onFocus, true)
      this.input.addEventListener('focusout', this.__onBlur, true)
    }
  },
  beforeDestroy () {
    // remove events
    if (this.inputType) {
      this.input.removeEventListener('focus', this.__onFocus, true)
      this.input.removeEventListener('blur', this.__onBlur, true)
      this.input.removeEventListener('input', this.__onInput, true)
    } else {
      this.input.removeEventListener('deactivate', this.__onFocus, true)
      this.input.removeEventListener('deactivate', this.__onBlur, true)
    }
  }
}
</script>

