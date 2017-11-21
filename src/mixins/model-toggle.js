import History from '../plugins/history'

// Needs:
// __show()
// __hide()
// Calling this.showPromiseResolve, this.hidePromiseResolve
// withHistory = true scope var for cordova backbutton
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
      console.log(this.$options.name, '__updateModel value watcher', val, this.showing)
      if (this.disable && val) {
        this.$emit('input', false)
        return
      }

      if (val !== this.showing) {
        this[val ? 'show' : 'hide']()
      }
    },
    showing (val) {
      console.log(this.$options.name, '__updateModel showing watcher', val, this.value)
      if (this.value !== val) {
        this.$emit('input', val)

        if (this.withHistory) {
          if (val) {
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
      }
    }
  },
  methods: {
    toggle (evt) {
      if (!this.disable) {
        return this[this.showing ? 'hide' : 'show'](evt)
      }
    },
    show (evt) {
      if (this.disable) {
        return Promise.reject(new Error())
      }

      console.log('show')
      if (this.showing) {
        return this.showPromise
      }

      this.showing = true
      this.showPromise = new Promise((resolve, reject) => {
        this.showPromiseResolve = () => {
          this.$emit('show')
          resolve()
        }
        this.showPromiseReject = () => {
          reject(new Error())
        }
      })
      this.__show(evt)
      return this.showPromise
    },
    hide (evt) {
      console.log('hide')
      if (!this.showing) {
        console.log('hide aborting')
        return this.hidePromise || Promise.resolve()
      }

      this.showing = false
      this.hidePromise = new Promise((resolve, reject) => {
        this.hidePromiseResolve = () => {
          this.$emit('hide')
          resolve()
        }
        this.hidePromiseReject = () => {
          reject(new Error())
        }
      })
      this.__hide(evt)
      return this.hidePromise
    }
  },
  beforeDestroy () {
    if (this.showing) {
      console.log('beforeDestroy calling hide')
      this.showPromiseReject && this.showPromiseReject()
      this.hidePromiseReject && this.hidePromiseReject()
      this.$emit('input', false)
      this.__hide()
    }
  }
}
