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
      type: String, // 'floating' | 'stacked' | 'inside' | inline' | 'nolabel' | custom
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
      layoutClass: 'float-label layout-' + this.layout + (this.icon ? ' fl-icon' : '') + (this.dense ? ' fl-dense' : ''),
      state: {
        hasFocus: false,
        hasValue: false,
        hasInvalid: false,
        hasReadOnly: false,
        hasDisabled: false
      }
    }
  },
  computed: {
    cssFloatingLabel () {
      let
        s = this.state,
        css =
        [
          [this.layoutClass],
          {
            'fl-active': s.hasFocus || s.hasValue || s.hasReadOnly,
            'fl-focus': s.hasFocus,
            'fl-value': s.hasValue,
            'fl-invalid': s.hasInvalid,
            'fl-read-only': s.hasReadOnly,
            'fl-disabled': s.hasFocus
          }
        ]
      return css
    }
  },
       // 'float-label': true, // NB: Distinct from existing Quasar 'floating-label'
       //  [this.layoutClass]: true,
  methods: {
    __update (e) {
      let
        s = this.state,
        etype = e ? e.type : ''
      s.hasFocus = etype === 'focus' ? true : etype === 'blur' ? false : s.hasFocus
      s.hasValue = this.input.value ? true : false
      s.hasInvalid = !this.input.validity.valid
      s.hasReadOnly = this.input.readOnly
      s.hasDisabled = this.input.disabled
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

