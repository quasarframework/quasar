<template>
  <div
    class='floating-label'
    :class='cssFloatingLabelActivity'
  >
    <slot ref='input'></slot>
    <label>{{ label }}</label>

    <pre>{{ $refs }} </pre>
  </div>
</template>

<script>
// import Utils from '../../utils'
// import Platform from '../../features/platform'
/* eslint-disable */
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      state: {
        inputType: null,
        hasFocus: false,
        hasValue: false,
        hasValid: false,
        hasDisabled: false,
        hasReadonly: false  // can have focus
      }
    }
  },
  computed: {
    isActive () {
      let s = this.state
      return s.hasValue || ( s.hasFocus && !s.hasReadOnly )  // Is it actually this simple!?
    },
    cssFloatingLabelActivity () {
      return this.isActive === true ? 'floating-label-active' : 'floating-label-inactive'
    }
  },
  methods: {
    __update (e) {
      let
        s = this.state,
        input = e.target
      s.hasFocus = e.type === 'focus' ? true : e.type === 'blur' ? false : s.hasFocus
      s.hasValue = input.value ? true : false
      s.hasValid = input.validity.valid
      s.hasDisabled = input.disabled
      s.hasReadonly = input.readOnly
    }
  },
  mounted () {
    // this.state.inputType = this.$refs['input'].type
    this.$el.addEventListener('focus', this.__update, true)
    this.$el.addEventListener('blur', this.__update, true)
  },
  beforeDestroy () {
    this.$el.removeEventListener('focus', this.__update, true)
    this.$el.removeEventListener('blur', this.__update, true)
  }
}
</script>

