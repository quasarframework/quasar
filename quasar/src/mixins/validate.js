import { testPattern } from '../utils/patterns.js'

export default {
  props: {
    error: Boolean,
    errorMessage: String,

    rules: Array,
    lazyRules: Boolean,
    disabledRules: Boolean,
    validationLabel: String
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
      if (this.isDirty === false) { return }
      this.validate(v, lazy = false, disabled = false)
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
    getRule (original) {
      let rule = {}
      rule.handler = () => true
      rule.args = undefined
      rule.lazy = this.lazyRules
      rule.disabled = this.disabledRules
      rule.message = undefined
      rule.label = this.validationLabel || this.stackedLabel || this.floatLabel

      if (typeof original === 'object') {
        rule.args = original.args || rule.args
        rule.lazy = original.lazy || rule.lazy
        rule.disabled = original.disabled || rule.disabled
        rule.message = original.message || rule.message
        rule.label = original.label || rule.label
        original = original.handler
      }

      if (typeof original === 'function') {
        rule.handler = original
      }

      if (typeof original === 'string') {
        if (testPattern[original] !== void 0) {
          rule.handler = testPattern[original]
        }
      }
      return rule
    },
    async validate (val = this.value, lazy = true, disabled = true) {
      let results = []
      for (let i = 0; i < this.rules.length; i++) {
        const rule = this.getRule(this.rules[i])
        if ((!rule.disabled || disabled) && (!rule.lazy || lazy)) {
          const result = await this.validateRule(rule, val)
          if (result.error) {
            results.push(result)
          }
        }
      }
      if (results.length > 0) {
        this.innerError = results[0].error
        this.innerErrorMessage = results[0].msg
      }
    },
    async validateRule (rule) {
      let msg, error = false
      const args = typeof rule.args === 'function' ? rule.args() : rule.args
      const res = await Promise.resolve().then(() => rule.handler(val, args))
      var error = res !== true
      if (error) {
        if (!rule.message) {
          msg = res
        } else if (typeof rule.message === 'function') {
          msg = rule.message(rule.label)
        } else {
          msg = rule.message
        }
      }
      return { error, msg }
    },
    __triggerValidation () {
      if (this.isDirty === false && this.rules !== void 0) {
        this.isDirty = true
        this.validate(this.value, lazy = true, disabled = false)
      }
    }
  }
}
