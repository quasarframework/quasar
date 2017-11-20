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
      console.log(this.$options.name, '__updateModel watcher', val, this.showing)
      if (val) {
        if (!this.showing) {
          this.show()
        }
      }
      else if (this.showing) {
        this.hide()
      }
    }
  },
  methods: {
    toggle (evt) {
      return this[this.showing ? 'hide' : 'show'](evt)
    },
    __updateModel (val, noHistory) {
      console.log(this.$options.name, '__updateModel', val)
      if (this.showing !== val) {
        this.showing = val
        console.log(this.$options.name, '__updateModel set showing to', val)

        if (noHistory !== void 0) {
          // do nothing
        }
        else if (val) {
          this.__historyEntry = {
            handler: this.hide
          }
          History.add(this.__historyEntry)
        }
        else if (this.__historyEntry) {
          History.remove(this.__historyEntry)
          this.__historyEntry = null
        }
      }
      if (this.value !== val) {
        console.log(this.$options.name, '__updateModel emitting input', val)
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
