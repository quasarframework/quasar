import History from '../plugins/history'

export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      showing: false
    }
  },
  watch: {
    value (val) {
      if (val) { this.show() }
      else { this.hide() }
    }
  },
  methods: {
    toggle (evt) {
      return this[this.showing ? 'hide' : 'show'](evt)
    },
    __updateModel (val, noHistory) {
      if (this.showing !== val) {
        this.showing = val

        if (noHistory !== void 0) {
          // do nothing
        }
        else if (val) {
          this.__historyEntry = {
            handler: this.close
          }
          History.add(this.__historyEntry)
        }
        else if (this.__historyEntry) {
          History.remove(this.__historyEntry)
          this.__historyEntry = null
        }
      }
      if (this.value !== val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    if (this.value) {
      this.show()
    }
  }
}
