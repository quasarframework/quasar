<template>
  <div
    class='fl-container'
    :class='css_Container'
  >
    <div class='fl-inner'>
      <slot></slot>
      <label>{{ label }}</label>
      <span class='fl-error'>This is an error.,</span>
    </div>
    <i v-if='icon'>{{ icon }}</i>
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
      layoutCss:
        'fl-layout-' + this.layout
        + (this.icon ? ' fl-icon' : '')
        + (this.dense ? ' fl-dense' : ''),
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
    css_Container () {
      let
        s = this.state,
        css =
        [
          [this.layoutCss],
          {
            'fl-active': s.hasFocus || s.hasValue || s.hasReadOnly,
            'fl-focus': s.hasFocus,
            'fl-value': s.hasValue,
            'fl-invalid': s.hasInvalid,
            'fl-read-only': s.hasReadOnly,
            'fl-disabled': s.hasDisabled
          }
        ]
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
      s.hasInvalid = !this.input.validity.valid
      s.hasReadOnly = this.input.readOnly
      s.hasDisabled = this.input.disabled
    }
  },
  mounted () {
      this.input = this.$el.querySelector('input, textarea')
      if (!this.input) {
        throw new Error('<q-floating-label> is missing a required input/textarea element.')
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

