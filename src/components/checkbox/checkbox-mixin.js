export default {
  props: {
    value: {
      type: [Boolean, Array],
      required: true
    },
    val: {}
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        if (this.value !== val) {
          this.$emit('input', val)
        }
      }
    },
    isArray () {
      return Array.isArray(this.value)
    },
    index () {
      if (this.isArray) {
        return this.model.indexOf(this.val)
      }
    },
    isActive () {
      return this.isArray
        ? this.model.indexOf(this.val) > -1
        : this.model
    }
  },
  methods: {
    toggle (withBlur) {
      if (withBlur !== false) {
        this.$el.blur()
      }

      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index !== -1) {
          this.unselect()
        }
        else {
          this.select()
        }
        return
      }
      this.model = !this.model
      this.__onChange()
    },
    select () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index === -1) {
          this.model.push(this.val)
          this.__onChange()
        }
        return
      }
      this.model = true
      this.__onChange()
    },
    unselect () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index > -1) {
          this.model.splice(this.index, 1)
          this.__onChange()
        }
        return
      }
      this.model = false
      this.__onChange()
    },
    __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle()
      }
      else {
        this.__onChange()
      }
    },
    __onChange () {
      const ref = this.$refs.ripple
      if (ref) {
        ref.classList.add('active')
        setTimeout(() => {
          ref.classList.remove('active')
        }, 10)
      }
      this.$emit('change', this.model)
    }
  }
}
