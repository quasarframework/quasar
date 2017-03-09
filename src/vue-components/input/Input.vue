<template>
  <div
    class="q-input row items-start"
    :class="{
      disabled: disabled,
      readonly: readonly,
      focused: focused,
      'has-error': hasError,
      'has-label': label,
      textarea: isTextarea,
      dropdown: isDropdown,
      simple: simple
    }"
    @click="__click"
  >
    <i
      v-if="isNumber && !noExtraIcons"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(-step)"
    >remove</i>
    <slot name="before"></slot>
    <span v-if="prefix" class="q-input-comp" v-html="prefix"></span>
    <div
      class="q-input-target q-input-comp auto row"
      :class="{
        'relative-position': floatLabel && !labelIsAbove,
        flow: $slots['flow-before'] || $slots['flow-after']
      }"
    >
      <slot name="flow-before">
        <div
          v-if="label"
          class="q-input-label ellipsis full-width"
          :class="{above: labelIsAbove}"
          v-html="label"
          @click="focus"
        ></div>
      </slot>

      <textarea
        v-if="isTextarea"
        ref="input"
        :type="type"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        :name="name"
        :pattern="pattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        class="auto"
        tabindex="0"
      ></textarea>
      <div
        ref="input"
        v-else-if="isDropdown"
        v-text="model"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        tabindex="0"
        class="auto no-outline ellipsis q-input-dropdown"
      ></div>
      <input
        v-else
        ref="input"
        :type="inputType"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        :name="name"
        :pattern="inputPattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || isDropdown"
        :required="required"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="computedStep"
        class="auto"
        tabindex="0"
      >

      <slot name="flow-after"></slot>
    </div>
    <i
      v-if="isPassword && !noExtraIcons"
      class="q-input-comp q-input-button"
      @click="togglePassVisibility"
      v-text="showPass ? 'visibility' : 'visibility_off'"
    ></i>
    <span v-if="suffix" class="q-input-comp" v-html="suffix"></span>
    <i
      v-if="hasClearIcon"
      class="q-input-comp q-input-button"
      @click="clear"
    >clear</i>
    <slot name="after"></slot>
    <i
      v-if="isNumber && !noExtraIcons"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(step)"
    >add</i>
    <span
      v-if="hasInlineCounter"
      class="q-input-comp q-input-faded q-input-small"
      v-html="counterLabel"
    ></span>
    <span v-if="isDropdown" class="q-input-comp q-input-button">
      <span class="caret"></span>
    </span>
    <div v-if="!simple" class="q-input-border"></div>
    <slot></slot>
  </div>
</template>

<script>
import inputTypes from './input-types'

function exists (val) {
  return typeof val !== 'undefined' && val !== null
}

export default {
  props: {
    name: String,
    value: {
      required: true
    },
    type: {
      type: String,
      default: 'text',
      validator (t) {
        return inputTypes.includes(t)
      }
    },
    autofocus: Boolean,
    pattern: String,
    prefix: String,
    suffix: String,
    placeholder: String,
    floatLabel: String,
    stackedLabel: String,
    error: Boolean,
    simple: Boolean,
    count: {
      type: [Number, Boolean],
      default: false
    },
    maxlength: [Number, String],
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    noExtraIcons: Boolean,
    clearable: Boolean,
    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      focused: false,
      showPass: false,
      field: false
    }
  },
  watch: {
    count () {
      this.__notify('count')
    },
    inlineCount () {
      this.__notify('count')
    },
    hasError () {
      this.__notify('error')
    },
    focused () {
      this.__notify('focus')
    }
  },
  computed: {
    model: {
      get () {
        this.__notify('count')
        return this.value
      },
      set (val) {
        if (this.editable && this.value !== val) {
          this.$emit('input', val)
        }
      }
    },
    label () {
      const label = this.stackedLabel || this.floatLabel
      this.__notify('floating', Boolean(label))
      return label
    },
    labelIsAbove () {
      return this.focused || this.stackedLabel || this.length > 0
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    isNumber () {
      return this.type === 'number'
    },
    editable () {
      return !this.disabled && !this.readonly && !this.isDropdown
    },
    length () {
      return exists(this.value) ? ('' + this.value).length : 0
    },
    counterLabel () {
      return `${this.length}${this.count !== true && this.count > 0 ? ` / ${this.count}` : ''}`
    },
    hasClearIcon () {
      return this.clearable && this.length
    },
    hasCountError () {
      if (this.count !== true && this.count > 0) {
        return this.length > this.count
      }
    },
    hasInvalidNumber () {
      return this.value !== '' && (
        (exists(this.min) && this.value < this.min) ||
        (exists(this.max) && this.value > this.max)
      )
    },
    hasInlineCounter () {
      return this.count && !this.hasField
    },
    hasError () {
      if (this.isNumber && this.hasInvalidNumber) {
        return true
      }
      return this.error || this.hasCountError
    },
    isPassword () {
      return this.type === 'password'
    },
    isDropdown () {
      return this.type === 'dropdown'
    },
    inputType () {
      return this.isPassword
        ? (this.showPass ? 'text' : 'password')
        : (this.isDropdown ? 'text' : this.type)
    },
    inputPattern () {
      if (this.isNumber) {
        return this.pattern || '[0-9]*'
      }
    },
    inputEl () {
      return this.$refs.input
    },
    computedStep () {
      if (this.isNumer) {
        return this.step
      }
    }
  },
  inject: ['hasField', '__setFieldFocus', '__setFieldCounter', '__setFieldFloating', '__setFieldError'],
  methods: {
    setValue (val) {
      this.model = val.target ? val.target.value : val
    },
    setNumberByOffset (offset = 0) {
      let val = exists(this.value)
        ? this.value + offset
        : (exists(this.min) ? this.min : 0)

      if (exists(this.min) && val < this.min) {
        val = this.min
      }
      else if (exists(this.max) && val > this.max) {
        val = this.max
      }

      this.model = parseFloat(val).toFixed(this.maxDecimals)
    },
    focus () {
      if (this.editable || this.isDropdown) {
        this.$refs.input.focus()
      }
    },
    blur () {
      if (this.editable || this.isDropdown) {
        this.$refs.input.blur()
      }
    },
    clear () {
      if (this.editable) {
        this.model = null
      }
    },
    togglePassVisibility () {
      this.showPass = !this.showPass
    },
    __focus (e) {
      this.focused = true
      this.$emit('focus')
    },
    __blur (e) {
      this.focused = false
      this.$emit('blur')
    },
    __keydown (e) {
      this.$emit('keydown', e)
    },
    __keyup (e) {
      this.$emit('keyup', e)
    },
    __click (e) {
      this.focus()
      this.$emit('click', e)
    },
    __notify (type, value) {
      if (!this.hasField) {
        return
      }

      this.$nextTick(() => {
        if (type === 'error') {
          this.__setFieldError(value !== false && this.hasError)
        }
        else if (type === 'focus') {
          this.__setFieldFocus(this.focused)
        }
        else if (type === 'count') {
          this.__setFieldCounter(!this.count ? false : this.counterLabel, this.hasCountError)
        }
        else if (type === 'floating') {
          this.__setFieldFloating(value)
        }
      })
    },
    __mousedown (e) {
      if (!this.editable) {
        e.preventDefault()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.__notify('count')
      if (this.autofocus) {
        this.focus()
      }
    })
  },
  beforeDestroy () {
    this.__notify('count')
    this.__notify('floating', false)
    this.__notify('error', false)
  }
}
</script>
