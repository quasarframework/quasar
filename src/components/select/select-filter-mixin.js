// import { stopAndPrevent } from '../../utils/event.js'

export default {
  props: {
    withFilter: Boolean,

    filterDebounce: {
      type: [Number, String],
      default: 500
    },

    loading: {
      type: Boolean,
      default: null
    }
  },

  methods: {
    __getFilter (h) {
      return h('input', {
        ref: 'target',
        staticClass: 'q-select__filter col',
        domProps: { value: this.filter },
        attrs: {
          disabled: this.editable !== true
        },
        on: {
          input: this.__onInputValue,
          focus: this.__onTargetFocus,
          blur: this.__onTargetBlur,
          keydown: this.__onTargetKeydown
        }
      })
    },

    __onInputValue (e) {
      console.log('__onInputValue')
      clearTimeout(this.filterTimer)

      this.filterTimer = setTimeout(() => {
        this.__filter(e.target.value)
      }, this.filterDebounce)
    },

    __filter (val) {
      this.menu = false
      this.filter = val
      this.$emit('filter', val)

      this.$nextTick(() => {
        if (this.focused === false) { return }

        if (this.loading !== true) {
          console.log('set menu', true)
          this.menu = true
        }
        else {
          const fn = loading => {
            if (loading === false && this.unWatchLoading !== void 0) {
              if (this.focused === true) {
                this.menu = true
              }
              this.unWatchLoading()
              this.unWatchLoading = void 0
            }
          }
          this.unWatchLoading = this.$watch('loading', fn)
        }
      })
    }
  },

  beforeDestroy () {
    this.unWatchLoading !== void 0 && this.unWatchLoading()
    clearTimeout(this.filterTimer)
  }
}
