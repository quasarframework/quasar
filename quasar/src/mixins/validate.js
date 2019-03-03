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
      if (this.rules === void 0) {
        return
      }
      if (this.lazyRules === true && this.isDirty === false) {
        return
      }

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
    this.validateIndex = 0
    this.$on('blur', this.__triggerValidation)
  },

  beforeDestroy () {
    this.$off('blur', this.__triggerValidation)
  },

  methods: {
    resetValidation () {
      this.validateIndex++
      this.innerLoading = false
      this.isDirty = false
      this.innerError = false
      this.innerErrorMessage = void 0
    },

    validate (val = this.value) {
      if (!this.rules || this.rules.length === 0) {
        return
      }

      this.validateIndex++

      if (this.innerLoading !== true && this.lazyRules !== true) {
        this.isDirty = true
      }

      const update = (err, msg) => {
        if (this.innerError !== err) {
          this.innerError = err
        }

        const m = msg || void 0
        if (this.innerErrorMessage !== m) {
          this.innerErrorMessage = m
        }

        if (this.innerLoading !== false) {
          this.innerLoading = false
        }
      }

      const promises = []

      for (let i = 0; i < this.rules.length; i++) {
        const rule = this.rules[i]
        let res

        if (typeof rule === 'function') {
          res = rule(val)
        }
        else if (typeof rule === 'string' && testPattern[rule] !== void 0) {
          res = testPattern[rule](val)
        }

        if (res === false || typeof res === 'string') {
          update(true, res)
          return
        }
        else if (res !== true && res !== void 0) {
          promises.push(res)
        }
      }

      if (promises.length === 0) {
        update(false)
        return
      }

      if (this.innerLoading !== true) {
        this.innerLoading = true
      }

      const index = this.validateIndex

      Promise.all(promises).then(
        res => {
          if (index === this.validateIndex) {
            if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
              update(false)
            }
            else {
              const msg = res.find(r => r === false || typeof r === 'string')
              update(msg !== void 0, msg)
            }
          }
        },
        (e) => {
          if (index === this.validateIndex) {
            console.error(e)
            update(true)
          }
        }
      )
    },

    __triggerValidation () {
      if (this.isDirty === false && this.rules !== void 0) {
        this.isDirty = true
        this.validate(this.value)
      }
    }
  }
}
