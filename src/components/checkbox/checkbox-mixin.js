export default {
  props: {
    value: {
      type: [Boolean, Array],
      required: true
    },
    val: {},
    color: String,
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
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
  watch: {
    isActive () {
      const ref = this.$refs.ripple
      if (ref) {
        ref.classList.add('active')
        setTimeout(() => {
          ref.classList.remove('active')
        }, 10)
      }
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
      if (!this.isArray) {
        this.model = !this.model
        return
      }

      if (this.index !== -1) {
        this.unselect()
      }
      else {
        this.select()
      }
    },
    select () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        this.model = true
        return
      }
      if (this.index === -1) {
        this.model.push(this.val)
      }
    },
    unselect () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        this.model = false
        return
      }
      if (this.index > -1) {
        this.model.splice(this.index, 1)
      }
    },
    __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle()
      }
    }
  }
}
