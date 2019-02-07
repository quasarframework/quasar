import { testPattern } from '../utils/patterns.js'

export default {
  props: {
    error: Boolean,
    errorMessage: String,

    rules: Array,
    lazyRules: Boolean
  },

  data () {
    return {
      isDirty: false,
      innerError: false,
      innerErrorMessage: void 0
    }
  },

  watch: {
    value (v) {
      if (this.rules === void 0) { return }
      if (this.lazyRules === true && this.isDirty === false) { return }

      this.validate(v)
    }
  },

  computed: {
    hasError () {
      return this.error === true || this.innerError === true
    },

    computedErrorMessage () {
      return this.errorMessage !== void 0
        ? this.errorMessage
        : this.innerErrorMessage
    }
  },

  mounted () {
    this.$on('blur', this.__triggerValidation)
  },

  beforeDestroy () {
    this.$off('blur', this.__triggerValidation)
  },

  methods: {
    resetValidation () {
      this.isDirty = false
      this.innerError = false
      this.innerErrorMessage = void 0
    },

    validate (val = this.value) {
      let msg, error = false

      for (let i = 0; i < this.rules.length; i++) {
        const rule = this.rules[i]
        if (typeof rule === 'function') {
          const res = rule(val)

          if (typeof res === 'string') {
            error = true
            msg = res
            break
          }
        }
        else if (typeof rule === 'string' && testPattern[rule] !== void 0) {
          if (testPattern[rule](val) !== true) {
            error = true
            break
          }
        }
      }

      if (this.innerError !== error) {
        this.innerError = error
      }
      if (this.innerErrorMessage !== msg) {
        this.innerErrorMessage = msg
      }
    },

    __triggerValidation () {
      if (this.isDirty === false && this.rules !== void 0) {
        this.isDirty = true
        this.validate(this.value)
      }
    }
  }
}
