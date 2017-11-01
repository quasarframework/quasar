export default {
  props: {
    value: Boolean
  },
  watch: {
    value (v) {
      if (v) {
        this.open()
      }
      else {
        this.close()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.value) {
          this.open()
        }
      }, 100)
    })
  },
  methods: {
    __updateModel (val) {
      if (this.value !== val) {
        this.$emit('input', val)
      }
    }
  }
}
