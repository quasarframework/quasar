import History from '../plugins/history'

// Needs:
// __show()
// __hide()
// Calling this.showPromiseResolve, this.hidePromiseResolve
// avoid backbutton with setting noShowingHistory
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
      if (this.disable && val) {
        this.$emit('input', false)
        return
      }

      console.log(this.$options.name, '__updateModel value watcher', val, this.showing)
      if ((val && !this.showing) || (!val && this.showing)) {
        this[val ? 'show' : 'hide']()
      }
    },
    showing (val) {
      if (val !== this.value) {
        this.$emit('input', val)
        return
      }

      if (this.$options.noShowingHistory) {
        return
      }

      console.log(this.$options.name, '__updateModel showing watcher', val, this.value)
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
      return this[this.showing ? 'hide' : 'show'](evt)
    },
    show (evt) {
      if (this.disable) {
        return Promise.reject(new Error())
      }

      console.log('show')
      if (this.showing) {
        console.log('show already in progress')
        return this.showPromise || Promise.resolve()
      }

      if (this.hidePromise) {
        this.hidePromiseReject()
      }

      this.showing = true
      const showPromise = new Promise((resolve, reject) => {
        this.showPromiseResolve = (evt) => {
          this.showPromise = null
          this.$emit('show')
          resolve(evt)
        }
        this.showPromiseReject = () => {
          this.showPromise = null
          reject(new Error())
        }
      })
      this.showPromise = showPromise

      if (this.__show) {
        this.__show(evt)
      }
      else {
        this.showPromiseResolve(evt)
      }

      return showPromise
    },
    hide (evt) {
      console.log('hide')
      if (!this.showing) {
        console.log('hide already in progress')
        return this.hidePromise || Promise.resolve()
      }

      if (this.showPromise) {
        this.showPromiseReject()
      }

      this.showing = false
      const hidePromise = new Promise((resolve, reject) => {
        this.hidePromiseResolve = (evt) => {
          this.hidePromise = null
          this.$emit('hide')
          resolve(evt)
        }
        this.hidePromiseReject = () => {
          this.hidePromise = null
          reject(new Error())
        }
      })
      this.hidePromise = hidePromise
      if (this.__hide) {
        this.__hide(evt)
      }
      else {
        this.hidePromiseResolve(evt)
      }
      return hidePromise
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
