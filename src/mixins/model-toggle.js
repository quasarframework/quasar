import History from './history'

export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      active: this.value
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.open()
          History.add({
            handler: this.close
          })
        }
        else {
          this.close()
          History.remove()
        }
      },
      immediate: true
    },
    $route () {
      this.close()
    }
  },
  methods: {
    toggle (cb) {
      if (this.value) {
        this.close(cb)
      }
      else {
        this.open(cb)
      }
    },
    __updateModel (val) {
      console.log('X __updateModel', val)
      if (this.active !== val) {
        this.active = val
      }
      if (this.value !== val) {
        this.$emit('input', val)
      }
    }
  }
}
