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
  <div class='field row' :class='css_Field'>
    <i v-if='draw_Icon' class="field-icon" :class='css_Icon1'>{{ icon }}</i>
    <label v-if='txt_InlineLabel' :style='style_InlineLabel' class='field-label-inline' :for='inputId'>{{ txt_InlineLabel }}:</label>
    <slot name="before"></slot>
    <span v-if="before">{{ before }}</span>
    <slot v-if="noTarget"></slot>
    <div v-else class="field-target" :class='css_FieldTarget' :style='style_FieldTarget' ref="ref_FieldTarget">
      <div class="field-input row" :class='css_FieldInput'><!--
     --><span v-if="prefix">{{ prefix }}</span><label v-if='txt_FloatLabel' :style='style_FloatLabel' class='field-label-float' :class='css_FloatLabel' :for='inputId' ><span v-if="prefix">{{ prefix }}</span>{{ txt_FloatLabel }}<div v-if="draw_Required">*</div><span v-if="postfix">{{ postfix }}</span></label><slot></slot><span v-if="postfix">{{ postfix }}</span><!--
   --></div>
      <div v-if='txt_Counter' class="field-counter">{{ txt_Counter }}</div>
      <div v-if='txt_Hint' class="field-hint">{{ hint }}</div>
      <div v-if='txt_ValidateMsg' class="field-validate-msg">{{ txt_ValidateMsg }}</div>
    </div>
    <span v-if="after">{{ after }}</span>
    <slot name="after"></slot>
    <i v-if='draw_Icon2' class="field-icon" :class='css_Icon2'>{{ icon2 }}</i>
  </div>
  <!--
    <i v-if='draw_Icon' class="item-primary">{{ icon }}</i>
    <div class="item-content" :class='css_FieldContent'>
      <div class="field-target" :class='css_FieldTarget' :style='style_FieldTarget' ref="ref_FieldTarget">
        <label v-if='txt_Float' :style='style_FieldLabel' class='field-label' :class='css_Float' :for='inputId'>{{ txt_Float }}</label><slot></slot>
        <div class='field-swoosh'></div>
        <span v-if='draw_Counter' class="field-counter">{{ txt_Counter }}</span>
        <span v-if='txt_Hint' class="field-hint">{{ hint }}</span>
        <span v-if='draw_Validate' class="field-validate-msg">{{ txt_ValidateMsg }}</span>
      </div>
    </div>
    <i v-if='draw_Icon2' class="item-secondary" >{{ icon2 }}</i>  -->

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
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    denseHorizontal: {
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
      type: [String, Boolean], // false (default) | 'immediate' | 'eager' true | 'lazy' | 'submit' (TBA)
      default: false
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
      myLayout: null,
      myTarget: null,
      // derived properties
      input: null,
      inputType: null,
      inputId: null,
      isTextInput: null,
      isSingleInput: null,
      numChildFields: 0,
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
      // validate + input =>  'eager' | 'lazy' | 'form' | false
      return !this.validate ? false : this.validate === true ? 'eager' : (this.validate === 'lazy-at-first' && this.state.hasBeenInvalid) ? 'eager' : this.validate
    },
    canValidate () {
      // potentially validate?
      return this.validateImmediate || !!this.myValidate
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
          ['field-layout-' + this.myLayout]: true,
          // [this.draw_TargetOnly ? 'target-only' : this.item ? 'item multiple-lines' : 'clean-item']: true,
          [this.item ? 'item multiple-lines' : 'clean-item']: true,
          'field-can-msg': !!this.validate || !!this.hint,
          'field-dense-v': this.dense,
          'field-dense-h': this.denseHorizontal,
          'field-active': s.hasFocus || s.hasValue || s.hasReadOnly,
          'field-focus': s.hasFocus,
          'field-value': s.hasValue,
          'field-was-invalid': s.hasBeenInvalid,
          'field-invalid': this.validate && s.hasInvalid === true,
          'field-valid': this.validate && s.hasInvalid === false,
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
      return !this.validate || !this.input || this.validateMsg === false ? false : this.validateMsg ? this.validateMsg : this.isTextInput && this.input.validity.valueMissing ? 'Please enter a value.' : 'Please enter a valid value.'
      // TODO: Allow msg update / multiple msgs / `vee-validate` integration?
    }
  },
  watch: {
    'state.hasInvalid':  {
      handler: function(newValue, oldValue) {
        console.log('emit fieldevent --> ', {'hasInvalid': newValue})
        this.$emit('fieldEvent', {'hasInvalid': newValue})
      }
      // ,
      // immediate: true
    },
    counter () {
      // TODO: Tidy up all these misc. prop changes with a proper (!) interface for controlling component instances.
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
    handleClick (e) {
      console.log('HANDLE CLICK')
    },
    __onFieldEvent (e) {
      console.log('Handle Q-Field Event', e)
      if('hasInvalid' in e) {
        this.__updateState_validity()
      } else if ('focus' in e) {
        this.__onFocus()
      } else if ('blur' in e) {
        this.__onBlur()
      }
    },
    __onFocus (e) {
      this.state.hasFocus = true
      this.$emit('fieldEvent', {'focus': true})
    },
    __onBlur (e) {
      // Numeric input display value workaround (a bit hacky)
      if (this.input.type === 'number' && !this.input.value && !this.input.ignoreBlur && (this.myValidate === 'lazy' || this.myValidate === 'eager')) {
        this.input.value = ''
        this.input.ignoreBlur = true
        this.input.blur()
        this.input.ignoreBlur = false
        this.__updateState_validity()
      }
      this.state.hasFocus = false
      this.state.hasTouched = true
      this.$emit('fieldEvent', {'blur': true})
      if (this.myValidate === 'eager' || this.myValidate === 'lazy' || this.myValidate === 'lazy-at-first') {
        this.__updateState_validity()
      }
    },
    __onActivate (e) {
      // "activate" is click (touch??) anywhere on field.
      // Focus is placed on first available input or child field.
      // (TODO: Make optional)
      if (this.numChildFields === 0 && this.isTextInput && !this.state.hasDisabled) {
        this.input.focus()
      } else {
        this.childFields.find(e => {return e.isTextInput && !e.state.hasDisabled}).input.focus()
      }
    },
    __onInput (e) {
      if (e) {
        e.stopPropagation()
        e.cancelBubble = true
      }
      this.hasTouched = true
      this.__updateState_value()
      if (this.myValidate === 'eager') {
        this.__updateState_validity()
      }
      this.__updateState_counter()
    },
    // State maintenance
    // NB: These can't go in computed/watchers as they rely on changes to <input> attrs.
    __initState () {
      // TODO: Enable change after render...
      this.state.hasRequired = this.input.required
      this.state.hasReadOnly = this.input.readOnly
      this.state.hasDisabled = this.input.disabled
    },
    __updateState_value() {
      this.state.hasValue = this.input.value ? true : false
    },
    __updateState_counter () {
      this.state.currentChars = this.input.value.length
      this.state.hasTooLong = this.counter && this.myMaxlength && this.state.currentChars > this.myMaxlength ? true : false
      this.state.hasInvalid = this.state.hasTooLong ? true : this.state.hasInvalid
    },
    __updateState_validity () {
      // TODO: input.validity: {
      //   valid,
      //   badInput, customError, patternMismatch, rangeOverflow, rangeUnderflow, stepMismatch, tooLong, tooShort,typeMismatch, valueMissing

      /*
        'lazy' - validate on blur
        'eager' - validate on input
        'lazy-at-first' - validate on blur until error, then validate on input until clean

        validate (prop):                            false* | true/'eager' | 'lazy' | 'lazy-at-first' | 'form'
        myValidate (computed): validate + input =>  'eager' | 'lazy' | 'lazy-at-first' | 'form' : false
        validateImmediate (prop):                   false* | true

        state.hasTouched

                  >     myValidate=             validateImmediate=
          @initial      *                       true
          @input        'eager'|'laf'+touched
          @valueChange  ''
          @blur         'lazy'|'eager'|'laf'

        __updateState_validity():
          => state.hasInvalid:  input.validity + (state.hasValue || state.hasTouched) => true | false
      */

      if (!this.numChildFields) {
        // Leaf Field - invalid if input .validity==false or .hasTooLong==true
        this.state.hasInvalid = this.state.hasTooLong ? true : !this.input.validity.valid // && (this.state.hasValue || this.state.hasTouched)
      } else {
        // Branch Field - invalid if *every* (validatable) child has been validated AND *any* child is invalid.
        if (!this.childFields.some(e => e.canValidate && e.state.hasInvalid === null)) {
          this.state.hasInvalid = this.childFields.some(e => e.state.hasInvalid === true)
        }
      }
      if (this.state.hasInvalid === true) {
        this.state.hasBeenInvalid = true
      }
    }
  },
  mounted () {
    //
    // Identify Target, inputs, etc...

    // Case A:
    // <q-field>
    //   <input|textarea>  =>            isTargeted = true, isSingleInput = true, isTextInput = true
    // </q-field>

    // Case B:
    // <q-field>
    //   <q-field></q-field>[...] =>     isTargeted = true, isSingleInput = false, isTextInput = false
    // </q-field>

    // Case C:
    // <q-field>
    //   <otherComponent></otherComponent>[...] =>         isTargeted = true, isSingleInput = false, isTextInput = false
    // </q-field>

    // Case D:
    // <q-field>
    //   <other></other>[...] =>         isTargeted = false, isSingleInput = false, isTextInput = false
    // </q-field>


    let elms = this.$slots.default.filter(vnode => { return !!vnode.tag })

    if (elms.length === 0) {
      this.isSingleInput = false
      this.input = null
      console.warn('<q-field> missing content', this)
      return
    } else if (elms.length === 1 && elms[0].elm && TEXT_INPUT_TYPES.includes(elms[0].elm.type+'')) {
      console.log('<q-field> found 1 text input: ', this.inputType)

      // Case A) 1 child = <input|textarea>.  Target it.
      this.isSingleInput = true
      this.isTextInput = true // true = input|textarea
      this.input = elms[0].elm // input = <input|textarea>
      this.inputType = this.input.type
      this.__initState()
      this.__updateState_value()
      this.__updateState_counter()
      this.input.checkValidity()
      if (this.validateImmediate) {
        this.__updateState_validity()
      }
    } else if (elms.length === 1) {

      if (this.$children.length) {
        this.isTextInput = false // false = some component
        this.input = this.$children[0] // input = component

      }
      // Case B) 1 child = other component/element.  Target it.
      this.isSingleInput = true
      this.isTextInput = false

    } else {

      // > 1 child. Target them.
      this.isTextInput = false
      this.input = elms[0].elm

      // Add field event listeners to child <q-fields>.  They will tell me when to update my state.
      this.childFields = []
      this.$children.forEach(c => {
        if (c.$options._componentTag === 'q-field') {
          c.$on('fieldEvent', this.__onFieldEvent)
          this.childFields.push(c)  // <-- NB: Not watched due to recursion (apparently, reports Vue)
          this.numChildFields++
        }
      })

      // DEPRECATED: If all children are <q-fields>...
      // this.isTargeted = (this.numChildFields === this.$children.length)
      console.log('child, ', this.numChildFields, this.$children.length)
    }

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
    if (!this.layout || this.layout === 'inline') {
      // label-inline is main Label, float functions as optional msg.
      this.isInline = true
      this.myLabel = this.label
      // Option: Spare float label can now serve as extra hint text, using 'floatHint' and 'floatLayout'
      this.myLayout = this.floatHint ? this.floatLayout : this.layout
      this.myFloatHint = this.floatHint ? this.floatHint : null
    } else {
      // label-float is the main Label
      this.isInline = false
      this.myLabel = this.label
      this.myLayout = this.layout
      this.myFloatHint = this.label
    }

    // add events
    if (this.input && this.isTextInput === true) {
      this.$el.addEventListener('click', this.__onActivate, true)
      this.input.addEventListener('focus', this.__onFocus, true)
      this.input.addEventListener('blur', this.__onBlur, true)
      this.input.addEventListener('input', this.__onInput, true)
    } else if (this.input && this.isTextInput === false) {
      // TODO: Handle non-textual components properly!!
      // this.input.elm.addEventListener('focusin', this.__onFocus, true)
      // this.input.elm.addEventListener('focusout', this.__onBlur, true)
    }
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

