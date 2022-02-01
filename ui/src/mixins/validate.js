import { testPattern } from '../utils/patterns.js'
import debounce from '../utils/debounce.js'

const lazyRulesValues = [ true, false, 'ondemand' ]

export default {
  props: {
    value: {},

    error: {
      type: Boolean,
      default: null
    },
    errorMessage: String,
    noErrorIcon: Boolean,

    rules: Array,
    reactiveRules: Boolean,
    lazyRules: {
      type: [ Boolean, String ],
      validator: v => lazyRulesValues.includes(v)
    }
  },

  data () {
    return {
      isDirty: null,
      innerError: false,
      innerErrorMessage: void 0
    }
  },

  watch: {
    value () {
      this.__validateIfNeeded()
    },

    disable (val) {
      if (val === true) {
        this.__resetValidation()
      }
      else {
        this.__validateIfNeeded(true)
      }
    },

    reactiveRules: {
      handler (val) {
        if (val === true) {
          if (this.unwatchRules === void 0) {
            this.unwatchRules = this.$watch('rules', () => {
              this.__validateIfNeeded(true)
            })
          }
        }
        else if (this.unwatchRules !== void 0) {
          this.unwatchRules()
          this.unwatchRules = void 0
        }
      },
      immediate: true
    },

    focused (focused) {
      if (focused === true) {
        if (this.isDirty === null) {
          this.isDirty = false
        }
      }
      else if (this.isDirty === false) {
        this.isDirty = true

        if (
          this.hasActiveRules === true &&
          this.lazyRules !== 'ondemand' &&
          // Don't re-trigger if it's already in progress;
          // It might mean that focus switched to submit btn and
          // QForm's submit() has been called already (ENTER key)
          this.innerLoading === false
        ) {
          this.debouncedValidate()
        }
      }
    },

    hasError (invalid) {
      const targetEl = document.getElementById(this.targetUid)
      targetEl !== null && targetEl.setAttribute('aria-invalid', invalid === true)
    }
  },

  computed: {
    hasRules () {
      return this.rules !== void 0 &&
        this.rules !== null &&
        this.rules.length > 0
    },

    hasActiveRules () {
      return this.disable !== true && this.hasRules === true
    },

    hasError () {
      return this.error === true || this.innerError === true
    },

    computedErrorMessage () {
      return typeof this.errorMessage === 'string' && this.errorMessage.length > 0
        ? this.errorMessage
        : this.innerErrorMessage
    }
  },

  created () {
    this.debouncedValidate = debounce(this.validate, 0)
  },

  mounted () {
    this.validateIndex = 0
  },

  beforeDestroy () {
    this.unwatchRules !== void 0 && this.unwatchRules()
    this.debouncedValidate.cancel()
  },

  methods: {
    resetValidation () {
      this.isDirty = null
      this.__resetValidation()
    },

    /*
     * Return value
     *   - true (validation succeeded)
     *   - false (validation failed)
     *   - Promise (pending async validation)
     */
    validate (val = this.value) {
      if (this.hasActiveRules !== true) {
        return true
      }

      const index = ++this.validateIndex

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
          return false
        }
        else if (res !== true && res !== void 0) {
          promises.push(res)
        }
      }

      if (promises.length === 0) {
        update(false)
        return true
      }

      if (this.innerLoading !== true) {
        this.innerLoading = true
      }

      return Promise.all(promises).then(
        res => {
          if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
            index === this.validateIndex && update(false)
            return true
          }

          const msg = res.find(r => r === false || typeof r === 'string')
          index === this.validateIndex && update(msg !== void 0, msg)
          return msg === void 0
        },
        e => {
          if (index === this.validateIndex) {
            console.error(e)
            update(true)
          }

          return false
        }
      )
    },

    __resetValidation () {
      this.debouncedValidate.cancel()
      this.validateIndex++
      this.innerLoading = false
      this.innerError = false
      this.innerErrorMessage = void 0
    },

    __validateIfNeeded (changedRules) {
      if (
        this.hasActiveRules === true &&
        this.lazyRules !== 'ondemand' &&
        (this.isDirty === true || (this.lazyRules !== true && changedRules !== true))
      ) {
        this.debouncedValidate()
      }
    }
  }
}
