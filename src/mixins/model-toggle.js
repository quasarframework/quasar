import History from '../plugins/history'

// Needs:
// __show()
// __hide()
// Calling this.showPromiseResolve, this.hidePromiseResolve
// avoid backbutton with setting noShowingHistory
export default {
  props: {
    value: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      showing: false
    }
  },
  watch: {
    value (val) {
      if (this.disable && val) {
        this.$emit('input', false)
        return
      }
      console.log(this.$options.name, '__updateModel [value] watcher', val, this.showing)
      if (val !== this.showing) {
        this[val ? 'show' : 'hide']()
      }
    },
    showing (val) {
      if (val === null) {
        return
      }
      if (val !== this.value && this.value !== null) {
        console.warn('Mixed showing/value', val, this.value)
        this.showing = null
        this.$emit('input', val)
        return
      }

      if (this.$options.noShowingHistory) {
        return
      }

      console.log(this.$options.name, '__updateModel [showing] watcher', val, this.value)
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
        console.log('show already in progress')
        return this.showPromise || Promise.resolve(evt)
      }

      if (this.hidePromise) {
        this.hidePromiseReject()
      }

      this.showing = true
      this.$emit('input', true)

      if (!this.__show) {
        this.$emit('show')
        this.showPromise = null
        this.showPromiseResolve = null
        this.showPromiseReject = null
        return Promise.resolve(evt)
      }

      this.showPromise = new Promise((resolve, reject) => {
        this.showPromiseResolve = () => {
          this.showPromise = null
          this.showPromiseResolve = null
          this.showPromiseReject = null
          this.$emit('show')
          resolve(evt)
        }
        this.showPromiseReject = () => {
          this.showPromise = null
          this.showPromiseResolve = null
          this.showPromiseReject = null
          reject(new Error())
        }
      })

      this.__show(evt)

      return this.showPromise || Promise.resolve(evt)
    },
    hide (evt) {
      console.log('hide')
      if (!this.showing) {
        console.log('hide already in progress')
        return this.hidePromise || Promise.resolve(evt)
      }

      if (this.showPromise) {
        this.showPromiseReject()
      }

      this.showing = false
      this.$emit('input', false)

      if (!this.__hide) {
        this.$emit('hide')
        this.hidePromise = null
        this.hidePromiseResolve = null
        this.hidePromiseReject = null
        return Promise.resolve(evt)
      }

      this.hidePromise = new Promise((resolve, reject) => {
        this.hidePromiseResolve = () => {
          this.hidePromise = null
          this.hidePromiseResolve = null
          this.hidePromiseReject = null
          this.$emit('hide')
          resolve(evt)
        }
        this.hidePromiseReject = () => {
          this.hidePromise = null
          this.hidePromiseResolve = null
          this.hidePromiseReject = null
          reject(new Error())
        }
      })

      this.__hide(evt)

      return this.hidePromise || Promise.resolve(evt)
    }
  },
  beforeDestroy () {
    if (this.showing) {
      console.log('beforeDestroy calling hide')
      this.showPromise && this.showPromiseReject()
      this.hidePromise && this.hidePromiseReject()
      this.$emit('input', false)
      this.__hide && this.__hide()
    }
  }
}
