<template>
  <div :class='cssFloatingLabel'>
    <i v-if='icon'>{{ icon }}</i>
    <slot></slot>
    <label>{{ label }}</label>
  </div>
</template>

<script>
// TODO:
/* eslint-disable */
// - React to changes in input attributes: disabled/readonly/value, etc.
// - iOS styles
export default {
  name: 'q-float-label',
  props: {
    label: {
      type: String,
      required: true
    },
    layout: {
      type: String, // 'floating' | 'stacked' | 'inline'
      default: 'floating'
    },
    icon: {
      type: String
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      input: null,
      inputType: null,
      isStacked: this.layout === 'stacked',
      isInline: this.layout === 'inline',
      state: {
        hasFocus: false,
        hasValue: false,
        hasValid: false, // (unused)
        hasDisabled: false, // (unused)
        hasReadOnly: false,  // can receive focus
      }
    }
  },
  computed: {
    cssFloatingLabel () {
      let s = this.state
      let css = {
        'float-label': true, // NB: Distinct from existing Quasar 'floating-label'
        'label-active': this.isStacked || s.hasValue || s.hasReadOnly || s.hasFocus,
        'label-focus': s.hasFocus,
        'label-icon': this.icon,
        'label-dense': this.dense,
        'label-inline': this.isInline
      }
      return css
    }
  },
  methods: {
    __update (e) {
      let
        s = this.state,
        etype = e ? e.type : ''
      s.hasFocus = etype === 'focus' ? true : etype === 'blur' ? false : s.hasFocus
      s.hasValue = this.input.value ? true : false
      s.hasDisabled = this.input.disabled
      s.hasReadOnly = this.input.readOnly
      s.hasValid = this.input.validity.valid
    }
  },
  mounted () {
      this.input = this.$el.querySelector('input, textarea')
      if (!this.input) {
        console.warn('"<q-floating-label>" missing required <input> or <textarea>.')
        return
      }
      this.inputType = this.input.type
      this.$el.addEventListener('focus', this.__update, true)
      this.$el.addEventListener('blur', this.__update, true)
      this.__update()
  },
  beforeDestroy () {
    this.$el.removeEventListener('focus', this.__update, true)
    this.$el.removeEventListener('blur', this.__update, true)
  }
}
</script>

