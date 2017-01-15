<template>
  <div class='field row' :data-field-id="fieldId" :class='css_Field'><!--
      'Before':
    -->
    <i v-if='draw_Icon' class="field-icon field-icon-before" :class='css_Icon1'>{{ icon }}</i>
    <slot name="before"></slot>
    <span v-if="before">{{ before }}</span><!--
      Inline Label:
    -->
    <label v-if='txt_InlineLabel' :style='style_InlineLabel' :class='css_InlineLabel' class='field-label-inline' :for='inputId'>{{ txt_InlineLabel }}<div v-if="draw_Required">*</div>:</label><!--
      Targetless content...
    -->
    <slot v-if="noTarget"></slot><!--
      ...or, 'Target':    (TODO: Make this a sub-component)
    -->
    <div v-else class="field-target" :class='css_FieldTarget' :style='style_FieldTarget' ref="ref_FieldTarget">
      <div class="field-input row" :class='css_FieldInput'>
      <span v-if="prefix">{{ prefix }}</span><label v-if='txt_FloatLabel' :style='style_FloatLabel' class='field-label-float' :class='css_FloatLabel' :for='inputId' ><span v-if="prefix">{{ prefix }}</span>{{ txt_FloatLabel }}<div v-if="draw_Required">*</div><span v-if="postfix">{{ postfix }}</span></label><slot></slot><span v-if="postfix">{{ postfix }}</span>
    </div>
      <div v-if='txt_Counter' class="field-counter">{{ txt_Counter }}</div>
      <div v-if='txt_Hint' class="field-hint">{{ hint }}</div>
      <div v-if='txt_ValidateMsg' class="field-validate-msg">{{ txt_ValidateMsg }}</div>
    </div><!--
      'After':
    -->
    <span v-if="after">{{ after }}</span>
    <slot name="after"></slot>
    <i v-if='draw_Icon2' class="field-icon field-icon-after" :class='css_Icon2'>{{ icon2 }}</i>
  </div>
</template>

<script>
/* eslint-disable */
import { Utils } from 'quasar'
let TEXT_INPUT_TYPES = ['textarea','text','input','password','datetime','email','number','search','time','week','date','datetime-local','month','tel','url']
let fieldId = 0
export default {
  name: 'q-field',
  props: {
    item: {
      type: Boolean
    },
    label: {
      type: String
    },
    labelLayout: {
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
    prefix: {
      type: String
    },
    postfix: {
      type: String
    },
    before: {
      type: String
    },
    after: {
      type: String
    },
    counter: {
      type: Boolean
    },
    dense: {
      type: Boolean,
      default: false
    },
    denseHorizontal: {
      type: Boolean,
      default: false
    },
    denseVertical: {
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
      default: null // **NB: defaults to none for fields, 'grow' for items | 'shrink' | grow' | '#px' | '#%'
    },
    targetAlign: {
      type: String,
      default: null // defaults to none | 'shrink' | grow' | '#px' | '#%'
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
      type: String
    },
    iconInverse: {
      type: Boolean,
      default: false
    },
    icon2: {
      type: String
    },
    icon2Inverse: {
      type: Boolean,
      default: false
    },
    inset: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number
    },
    noUnderline: {
      type: Boolean,
      default: false
    },
    noTarget: {
      type: Boolean,
      default: false
    },
    validate: {
      type: [String, Boolean] // false (default) | 'immediate' | 'eager' true | 'lazy' | 'submit' (TBA)
    },
    validateImmediate: {
      type: Boolean, // false (default)
      default: false
    },
    validateMsg: {
      // BIG TODO: Handle multiple validation messages!!!
      type: [Boolean, String],
      default: null
    }
  },
  data () {
    return {
      // prop local aliases
      myLabel: null,
      myFloat: null,
      myLabelLayout: null,
      fieldId: '',
      // derived properties
      target: null,
      input: null,
      inputId: null,
      isInline: null,
      isTextInput: null,
      numChildFields: 0,
      // childFields: [], <-- can't be responsive data. TODO: Investigate
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
        hasBeenInvalid: null,
        currentChars: 0
      }
    }
  },
  computed: {
    test () {
      return this.input ? this.input.value : 'nada'
    },
    // Props - local aliases
    myMaxlength () {
      // If TEXT input, return...
      // 1. component "maxlength" prop, or  (NB: User-entry will be UNRESTRICTED)
      // 2. input 'maxlength' attr          (NB: User-entry will be LIMITED to 'maxlength' value)
      // otherwise 0 (no maxlength)
      return !this.isTextInput ? 0 : this.maxlength ? parseInt(this.maxlength, 10) : this.input.hasAttribute('maxlength') ? this.input.maxlength : 0
    },
    myValidate () {
      // validate + text input =>  'eager' | 'lazy' | 'lazy-at-first' | form' | false
      let out =  this.validate === false ? false : this.validate === '' ? 'eager' : (this.validate === 'lazy-at-first' && this.state.hasBeenInvalid) ? 'eager' : this.validate
      return out
    },
    myTargetWidth () {
      // NB: field=true defaults to width='grow'
      return this.item && !this.targetWidth ? 'grow' : this.targetWidth
    },
    myUnderline () {
      // NB: Can't use 'childFields[]' here because of recursion; use numChildFields instead.
      let out = this.myUnderline = this.underline !== null ? this.underline : this.numChildFields > 0 ? false : true
      return out
    },
    // Label & Target - Width / Align
    style_FieldTarget () {
      // shrink / grow / size <input> container
      let style = this.calcWidthStyle(this.myTargetWidth)
      // if (this.targetAlign === 'center' || this.targetAlign === 'right') {
      //   style['margin-left'] = 'auto'
      // }
      // if (this.targetAlign === 'center' || this.targetAlign === 'left') {
      //   style['margin-right'] = 'auto'
      // }
      return style
    },
    style_InlineLabel () {
      // if used as Label, then shrink / grow / size inline <label.item-label>
      return this.isInline ? this.calcWidthStyle(this.labelWidth) : ''
    },
    style_FloatLabel () {
      // if used as Label, then shrink / grow / size inline <label.item-label>
      return this.label && !this.isInline ? this.calcWidthStyle(this.labelWidth) : ''
    },
    // CSS Styles / Flags
    css_Field () {
      let
        s = this.state,
        css = {
          ['field-label-' + this.myLabelLayout]: true,
          // [this.draw_TargetOnly ? 'target-only' : this.item ? 'item multiple-lines' : 'clean-item']: true,
          // [this.item ? 'item multiple-lines' : 'clean-item']: true,
          'field-can-msg': !!this.validate || !!this.hint,
          'field-dense-vertical': this.dense || this.denseVertical,
          'field-dense-horizontal': this.dense || this.denseHorizontal,
          'field-active': s.hasFocus || s.hasValue || s.hasReadOnly,
          'field-focus': s.hasFocus,
          'field-value': s.hasValue,
          'field-was-invalid': s.hasBeenInvalid,
          'field-invalid': this.myValidate && s.hasInvalid === true,
          'field-valid': this.myValidate && s.hasInvalid === false,
          'field-pristine': this.state.hasTouched !== true,
          'field-dirty': this.state.hasTouched === true,
          'field-invalid-too-long': s.hasTooLong,
          'field-read-only': s.hasReadOnly,
          'field-disabled': s.hasDisabled,
          'field-required': s.hasRequired,
          'inset': this.inset
        }
      return css
    },
    css_Icon1 () {
      return this.iconInverse ? 'icon-inverse' : ''
    },
    css_Icon2 () {
      return this.icon2Inverse ? 'icon-inverse' : ''
    },
    css_FieldContent () {
      let css = {}
      return css
    },
    css_InlineLabel () {
      return {
        'field-label-as-text': this.inlineText,
        ['label-' + this.labelAlign]: !!this.labelAlign
      }
    },
    css_FloatLabel () {
      return {
        'field-label-as-text': this.floatText,
        ['label-' + this.labelAlign]: !!this.labelAlign
      }
    },
    css_FieldTarget () {
      return {
        ['target-' + this.targetAlign]: !!this.targetAlign
      }
    },
    css_FieldInput () {
      // if container defines a size then <input> with match container. (If not, container will match <input> so leave it alone.)
      return {
        'field-input-grow': this.myTargetWidth && this.myTargetWidth !== 'shrink',
        'underline': !this.noUnderline
      }
    },
    // View rules
    draw_TargetOnly () {
      return !this.item && !this.icon && !this.icon2 && !this.isInline
    },
    draw_Required () {
      return this.state.hasRequired
    },
    txt_Counter () {
      return !this.counter || !this.myMaxlength ? false : this.state.currentChars + ' / ' + this.myMaxlength
    },
    draw_Icon () {
      return !!this.icon
    },
    draw_Icon2 () {
      return !!this.icon2
    },
    txt_InlineLabel () {
      return this.isInline ? this.myLabel : ''
    },
    txt_FloatLabel () {
      return !this.isInline ? this.myLabel : this.myFloat
    },
    txt_Hint () {
      return this.hint // (this.draw_TargetOnly?'draw_TargetOnly=true':'draw_TargetOnly=false') + (this.draw_TargetOnly && !this.item ?' (pseudo)':'')  // this.hint
    },
    txt_ValidateMsg () {
      return !this.myValidate || this.validateMsg === false ? false : this.validateMsg ? this.validateMsg : this.isTextInput && this.input.validity.valueMissing ? 'Please enter a value.' : 'Please enter a valid value.'
      // TODO: Allow msg update / multiple msgs / `vee-validate` integration?
    }
  },
  watch: {
    // 'state.hasInvalid':  {
    //   handler: function(newValue, oldValue) {
    //     console.log('watched. fieldEvent #'+this.fieldId, {type: '__onValidate'})
    //     this.$emit('fieldEvent', {type: '__onValidate'})
    //   }
    //   // ,
    //   // immediate: true
    // },
    counter () {
      // TODO: Tidy up all these misc. prop changes with a proper (!) interface for controlling component instances.
      // (This is only needed to turn counter on/off after component initialised...)
      this.__updateState_value()
    },
  },
  methods: {
    // Utils
    calcWidthStyle (width, align) {
      let style = {}
      if (width === 'grow') {
        style['flex-grow'] = '1'
      } else if (width && width !== 'shrink') {
        style['width'] = width
      } else if (width) {
        style['flex-shrink'] = '1'
      }
      return style
    },
    // Events
    __onFieldEvent (e) {
      console.log('#' + this.fieldId + 'RECEIVED: FieldEvent ', e)
      this[e.type](e)  // focus | blur | activate | input | validate
    },
    __onClick (e) {
      console.log(this.fieldId + '.__onClick')
    },
    __onFocus (e) {
      console.log(this.fieldId + '.__onFocus')
      this.state.hasFocus = true
      this.$emit('fieldEvent', {type: '__onFocus', from: this.fieldId})
    },
    __onBlur (e) {
      console.log(this.fieldId + '.__onBlur')
      this.state.hasFocus = false
      this.state.hasTouched = true

      if (this.input) {

        console.log(this.fieldId + '.__onBlur')
        if (this.input.type === 'number' && !this.input.value && !this.input.ignoreBlur && (this.myValidate === 'lazy' || this.myValidate === 'eager')) {
          // type=number value workaround (a bit hacky)
          this.input.value = ''
          this.input.ignoreBlur = true
          this.input.blur()
          this.input.ignoreBlur = false
        }
        if (this.myValidate === 'eager' || this.myValidate === 'lazy' || this.myValidate === 'lazy-at-first') {
          this.__onValidate()
        }
      }
      this.__updateState_value()

      console.log(this.fieldId + '.__onBlur')
      this.$emit('fieldEvent', {type: '__onBlur', from: this.fieldId})
    },
    __onInput (e) {
      console.log(this.fieldId + '.__onInput', e, typeof e)

      // Called 1 of 3 ways:
      if (e.type === 'input') {
        // 1. Native input Event from <input|textarea>
        if (e.stopPropagation) e.stopPropagation()
        if (e.cancelBubble) e.cancelBubble = true
        this.__updateState_value()
      }
      if (typeof e === 'string') {
        // 2. Vue @input event from Vue component (not <q-field>, though)
        this.__updateState_value(e) // <-- pass value directly so as not to lag behind component update.
      }
      else if (e.type === '__onInput') {
        // 3. Field Event from child <q-field>
        // (No real use for this yet)
      }


      if (this.myValidate === 'eager') {
        this.__onValidate()
      }

      this.$emit('fieldEvent', {type: '__onInput', from: this.fieldId})
    },
    __onValidate (e) {
      if (!this.myValidate) return
      let oldValue = this.state.hasInvalid
      if (this.isTextInput) {
        // Leaf Field - Invalid if input .validity==false or .hasTooLong==true
        this.state.hasInvalid = this.state.hasTooLong ? true : !this.input.validity.valid // && (this.state.hasValue || this.state.hasTouched)
      } else if (this.numChildFields) {
        console.log("in on validate with child fields")
        // Branch Field - Invalid if there are none which have yet to be validated and at least one invalid.
        if (!this.childFields.some(e => e.myValidate && e.state.hasInvalid === null)) {
          this.state.hasInvalid = this.childFields.some(e => {
            return e.state.hasInvalid === true
          })
        }
      }

      if (this.state.hasInvalid === true) {
        this.state.hasBeenInvalid = true
      }

      if (this.state.hasInvalid != oldValue) {
        console.log(this.fieldId + '.$emit fieldEvent - __onValidate')
        this.$emit('fieldEvent', {type: '__onValidate', from: this.fieldId})
      }

    },
    __onActivate (e) {
      console.log('__onActivate #'+this.fieldId, e)
      // "activate" is click (touch??) anywhere on field.
      // Focus is placed on first available input or child field.
      // (TODO: Make this behaviour optional)

      if (e) {
        // Try-catch ~ too many reasons focus() isn't allowed!?
        try {
          if (this.isTextInput && !this.state.hasDisabled) {
            this.input.focus()
          } else if (this.numChildFields) {
            let input = this.childFields.find(e => {
              return e.isTextInput && !e.state.hasDisabled
            })
            if (input) {
              input.focus()
            }
          }
        } catch (e) {
            // Do nothing
            console.log(e)
        }
      }

      this.$emit('fieldEvent', {type: '__onActivate', from: this.fieldId})
    },
    // State maintenance
    // NB: These can't go in computed/watchers as they rely on changes to <input> attrs.
    __initState () {
      if (!this.input) return
      // TODO: Enable change after render...]
      this.state.hasRequired = this.input.required
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
      this.__updateState_value()
    },
    __updateState_value(theValue) {
      // Value may be passed by arg, but defaults to input.value
      theValue = typeof theValue !== 'undefined' ? theValue : this.input ? this.input.value : undefined

      console.log('testing ', theValue)

      this.state.hasValue = theValue && theValue.length ? true : false

      // Update counter
      if (!this.counter || !this.myMaxlength) return
      this.state.currentChars = theValue.length
      this.state.hasTooLong = this.counter && this.myMaxlength && this.state.currentChars > this.myMaxlength ? true : false
    }
  },
  mounted () {

    // Field UID (interal use only)
    this.fieldId = fieldId++

    // Identify target, input, isTextInput, child <q-field>s:
    //
    // !noTarget && <elem>.value  => input
    // noTarget || !<elem>.value  => !input
    // !input + <q-field(s)>      => numChildFields
    let vnodes = this.$slots.default // .filter(vnode => { return !!vnode.tag })

    // Identify input (first element found with a 'value' property)
    if (!this.noTarget) {

      let candidate = vnodes.find(vnode => {

        if (vnode.elm && TEXT_INPUT_TYPES.includes(vnode.elm.type+'')) {
          // Native element.value
          this.input = vnode.elm
          this.isTextInput = true
          return true
        }

        if (vnode.child && 'value' in vnode.child) {
          // Vue component.value
          this.input = vnode.child
          return true
        }

        return false
      })


    }

    if (this.input) {

      // Found an input (so ignore child fields)

      // Event Listeners
      //
      if (this.isTextInput) {
        this.input.addEventListener('input', this.__onInput, true)
      } else {
        this.input.$on('input', this.__onInput)
      }

      let pickerTextfield = this.isTextInput ? null : this.input.$children.find(c=>c.$options._componentTag === 'q-picker-textfield')
      if (pickerTextfield) {
        let popOver = pickerTextfield.$children.find(c=>c.$options._componentTag === 'q-popover')
        popOver.$on('open', this.__onFocus)
        popOver.$on('close', this.__onBlur)
      } else {
        this.$el.addEventListener('focus', this.__onFocus, true)
        this.$el.addEventListener('blur', this.__onBlur, true)
      }
this.$el.tabindex = 0
      // ID
      //
      if (this.input.id) {
        this.inputId = this.input.id
      } else {
        this.inputId = Utils.uid()
        this.input.id = this.inputId
      }


    }
    else {

      // No Input, look for child fields
      //
      this.childFields = []

      this.$children.forEach(child => {

        if (child.$options._componentTag === 'q-field') {
          child.$on('fieldEvent', this.__onFieldEvent)
          this.childFields.push(child)  // <-- NB:  this.childFields not watched due to recursion (apparently, reports Vue)
          this.numChildFields++
        }
      })

    }


    // Initialise state
    this.__initState()

    if (this.validateImmediate) {
      this.__onValidate()
    }


    // Sanitise Inline/Float Label Layouts
    if (!this.labelLayout || this.labelLayout === 'inline') {
      // label-inline is main Label, float functions as optional msg.
      this.isInline = true
      this.myLabel = this.label
      // Option: Spare float label can now serve as extra hint text, using 'floatHint' and 'floatLayout'
      this.myLabelLayout = this.floatHint ? this.floatLayout : this.labelLayout
      this.myFloatHint = this.floatHint ? this.floatHint : null
    } else {
      // label-float is the main Label
      this.isInline = false
      this.myLabel = this.label
      this.myLabelLayout = this.labelLayout
      this.myFloatHint = this.label
    }

  },
  beforeDestroy () {
    // remove events

    if (this.input) {

      if (this.isTextInput) {
        // Native HTML <input> or <textarea>

        this.input.removeEventListener('input', this.__onInput, true)
        this.input.removeEventListener('focus', this.__onFocus, true)
        this.input.removeEventListener('blur', this.__onBlur, true)
        // this.$el.addEventListener('click', this.__onClick, true)

      } else {
        // Vue component

        this.input.$off('input', this.__onInput)
        this.input.$off('open', this.__onFocus)
        this.input.$off('close', this.__onBlur)

      }

    }
    else {

      // Child fields

      this.childFields.forEach(child => {
        child.$off('fieldEvent', this.__onFieldEvent)
      })

    }

  }
}
</script>

