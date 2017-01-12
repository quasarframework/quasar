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

NEW


TODO:
<q-field targetType="text|textarea"

  -->
  <div class='field row' :data-field-id="fieldId" :class='css_Field'><!--
{{ fieldId}}  validate[{{ typeof validate + '-' + validate}}] myValidate[{{ myValidate }}]
      'Before':
    --><i v-if='draw_Icon' class="field-icon field-icon-before" :class='css_Icon1'>{{ icon }}</i>{{ fieldId}}
    <slot name="before"></slot>
    <span v-if="before">{{ before }}</span><!--

      Inline Label:
    --><label v-if='txt_InlineLabel' :style='style_InlineLabel' class='field-label-inline' :for='inputId'>{{ txt_InlineLabel }}:</label><!--

      Targetless Content...
    -->
    <slot v-if="noTarget"></slot><!--

      ...or, Target:
    -->
    <div v-else class="field-target" @input="__onInput" :class='css_FieldTarget' :style='style_FieldTarget' ref="ref_FieldTarget">
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
  /**
    TODO:
    - React to changes in input attributes: disabled/readonly/value, etc.
    - iOS styles
    - multiple validation messages
    - width handling
  */
import { Utils } from 'quasar'
let TEXT_INPUT_TYPES = ['textarea','text','input','password','datetime','email','number','search','time','week','date','datetime-local','month','tel','url']
let fieldId = 0
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
      // todo: field-icon
      type: String
    },
    iconInverse: {
      // todo: field-icon-inverse
      type: Boolean,
      default: false
    },
    icon2: {
      // todo: field-icon2
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
      fieldId: 'x',
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
        currentChars: null
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
    css_FieldContent () {
      let css = {}
      return css
    },
    css_FieldTarget () {
      // if container defines a size then <input> with match container. (If not, container will match <input> so leave it alone.)
      return {
        ['target-align-' + this.targetAlign]: !!this.targetAlign
      }
    },
    css_FieldInput () {
      // if container defines a size then <input> with match container. (If not, container will match <input> so leave it alone.)
      return {
        'field-input-grow': this.myTargetWidth && this.myTargetWidth !== 'shrink',
        ['target-align-' + this.targetAlign]: !!this.targetAlign,
        'underline': !this.noUnderline
      }
    },
    css_InlineLabel () {
      return {
        'field-label-as-text': this.inlineText,
        ['label-align-' + this.labelAlign]: !!this.labelAlign
      }
    },
    css_FloatLabel () {
      return {
        'field-label-as-text': this.floatText,
        ['label-align-' + this.labelAlign]: !!this.labelAlign
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
      this.__updateState_counter()
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
      this[e.type]()  // focus | blur | activate | input | validate
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
          // this.__onValidate()
        }
        if (this.myValidate === 'eager' || this.myValidate === 'lazy' || this.myValidate === 'lazy-at-first') {
          this.__onValidate()
        }
      }

      console.log(this.fieldId + '.__onBlur')
      this.$emit('fieldEvent', {type: '__onBlur', from: this.fieldId})
    },
    __onInput (e) {
      console.log(this.fieldId + '.__onInput')
      if (e) {
        // Native  event
        if (e.stopPropagation) {
          e.stopPropagation()
        }
        if (e.cancelBubble) {
          e.cancelBubble = true
        }
      }
      this.__updateState_value()
      if (this.myValidate === 'eager') {
        this.__onValidate()
      }
      if (this.counter) {
        this.__updateState_counter()
      }

      this.$emit('fieldEvent', {type: '__onInput', from: this.fieldId})
    },
    __onValidate (e) {
      console.log(this.fieldId + '.__onValidate')
      if (!this.myValidate) return

      console.log(this.fieldId + '.__onValidate')

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
    __initInputState () {
      // TODO: Enable change after render...
      this.state.hasRequired = this.input.required
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
      this.__updateState_value()
    },
    __updateState_value() {
      this.state.hasValue = this.input && this.input.value ? true : false
    },
    __updateState_counter () {
      this.state.currentChars = this.input.value.length
      this.state.hasTooLong = this.counter && this.myMaxlength && this.state.currentChars > this.myMaxlength ? true : false
      this.state.hasInvalid = this.state.hasTooLong ? true : this.state.hasInvalid
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

    console.log(this.fieldId +'.vnodes', vnodes)

    // Identify input (first element with a 'value' property)
    if (!this.noTarget) {

      let candidate = vnodes.find(vnode => {

        if (vnode.elm && TEXT_INPUT_TYPES.includes(vnode.elm.type+'')) {
          // Native element.value
          this.input = vnode.elm
          this.isTextInput = true

          console.log("FOUND input.value in vnodes:", this.input)
          return true
        }

        if (vnode.child && 'value' in vnode.child) {
          // Vue component.value
          this.input = vnode.child

          console.log("FOUND component.value in vnodes:", this.input)
          return true
        }

        return false
      })


    }

    if (this.input) {
      // Found an input - so ignore child fields.

      console.log("INPUT = TRUE")

      if (this.isTextInput) {
        // Native HTML <input> or <textarea>

        // this.$el.addEventListener('click', this.__onClick, true)
        this.input.addEventListener('focus', this.__onFocus, true)
        this.input.addEventListener('blur', this.__onBlur, true)
        // this.input.$on('input', this.__onInput)
        this.input.addEventListener('input', this.__onInput, true)

      } else {
        // Vue component
        this.input.$on('input', this.__onInput)

      }

    } else {

      console.log("INPUT = FALSE")

      console.log("Kids are: " + this.$children)

      this.childFields = []

      // Identify childFields, and add fieldEvent handlers
      this.$children.forEach(child => {
        console.log("CHECK KID", child)
        if (child.$options._componentTag === 'q-field') {
          console.log("FOUND Child q-field:", child)
          child.$on('fieldEvent', this.__onFieldEvent)
          this.childFields.push(child)  // <-- NB:  this.childFields not watched due to recursion (apparently, reports Vue)
          this.numChildFields++
        }
      })


    }


    //   if (vnodes.$children.length) {
    //     this.isTextInput = false // false = some component
    //     this.input = 'value' in this.$children[0] ? this.$children[0] : null // input = anything that has a 'value' property
    //     if (this.input) {
    //       this.input.$on('input', this.__onInput)
    //       this.__initInputState()
    //       this.myValidate = false   // <-- // TODO: Interact with components *properly*...
    //     }
    //   }
    //   // Case C) 1 child = other component/element.  Target it.
    //   this.isTextInput = false


    // if (vnodes.length === 0) {

    //   // a) NO VNODES

    //   // this.target = null
    //   // this.input = null
    //   // this.isTextInput = false
    //   console.warn('<q-field> is missing content.', this)
    //   return

    // } else if (vnodes.length === 1111) {

    //   // b) SINGLE VNODE

    //   if (!this.noTarget) {

    //     this.target = true  // Single elements are automatically targeted (unless user specificed 'no-target')
    //     this.input = 'value' in vnodes[0].elm ? vnodes[0].elm : null // Any element with a 'value' property (i.e. <input> <textarea> <q-select> etc. )
    //     this.isTextInput = this.input && TEXT_INPUT_TYPES.includes(vnodes[0].elm.type+'') // input is <input type='x'> or <textarea>

    //     if (this.input) {

    //       this.__initInputState()

    //       if (this.isTextInput) {

    //         this.__updateState_counter()
    //         this.input.checkValidity()
    //         if (this.validateImmediate) {
    //           this.__onValidate()
    //         }

    //       }

    //     }

    //   }

    // } else {

    //   // c) MULTIPLE VNODES

    //   // input = first vnode whose element has a 'value'
    //   // target IF input!=null
    //   console.log('mounting: ' + this.fieldId)

    //   if (vnodes.$children.length) {
    //     this.isTextInput = false // false = some component
    //     this.input = 'value' in this.$children[0] ? this.$children[0] : null // input = anything that has a 'value' property
    //     if (this.input) {
    //       this.input.$on('input', this.__onInput)
    //       this.__initInputState()
    //       this.myValidate = false   // <-- // TODO: Interact with components *properly*...
    //     }
    //   }
    //   // Case C) 1 child = other component/element.  Target it.
    //   this.isTextInput = false

    // }


    // // 2. IDENTIFY: Child <q-field> components
    // //
    // this.childFields = []


    // Id
    if (this.input) {
      if (this.input.id) {
        this.inputId = this.input.id
      } else {
        this.inputId = Utils.uid()
        this.input.id = this.inputId
      }
    }

    // Inline/Float Label Layout
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

    // add native event handlers to <input> and <textarea> elements
    // if (this.isTextInput === true) {
    //   this.$el.addEventListener('click', this.__onActivate, true)
    //   this.input.addEventListener('focus', this.__onFocus, true)
    //   this.input.addEventListener('blur', this.__onBlur, true)
    //   this.input.addEventListener('input', this.__onInput, true)
    // } else if (this.input && this.isTextInput === false) {
    //   console.log('aaaaa');
    //   this.$el.addEventListener('input', this.__onInput, true)
    //   // TODO: Handle non-textual components properly!!
    //   // this.input.elm.addEventListener('focusin', this.__onFocus, true)
    //   // this.input.elm.addEventListener('focusout', this.__onBlur, true)
    // }
  },
  beforeDestroy () {
    // remove events
    if (this.input && this.isTextInput === true) {
      this.$el.removeEventListener('click', this.__onActivate, true)
      this.input.removeEventListener('focus', this.__onFocus, true)
      this.input.removeEventListener('blur', this.__onBlur, true)
      this.input.removeEventListener('input', this.__onInput, true)
    } else if (this.input && this.isTextInput === false) {
      // this.input.elm.removeEventListener('deactivate', this.__onFocus, true)
      // this.input.elm.removeEventListener('deactivate', this.__onBlur, true)
    }
  }
}
</script>

