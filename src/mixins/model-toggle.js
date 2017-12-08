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

      this.$nextTick(() => {
        if (this.value !== this.showing) {
          this[val ? 'show' : 'hide']()
        }
      })
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

      if (this.showing) {
        return this.showPromise || Promise.resolve(evt)
      }

      if (this.hidePromise) {
        this.hidePromiseReject()
      }

      this.showing = true
      if (this.value === false) {
        this.$emit('input', true)
      }

      if (this.$options.modelToggle === void 0 || this.$options.modelToggle.history) {
        this.__historyEntry = {
          handler: this.hide
        }
        History.add(this.__historyEntry)
      }

      if (!this.__show) {
        this.$emit('show')
        return Promise.resolve(evt)
      }

      this.showPromise = new Promise((resolve, reject) => {
        this.showPromiseResolve = () => {
          this.showPromise = null
          this.$emit('show')
          resolve(evt)
        }
        this.showPromiseReject = () => {
          this.showPromise = null
          reject(new Error())
        }
      })

      this.__show(evt)
      return this.showPromise || Promise.resolve(evt)
    },
    hide (evt) {
      if (this.disable) {
        return Promise.reject(new Error())
      }

      if (!this.showing) {
        return this.hidePromise || Promise.resolve(evt)
      }

      if (this.showPromise) {
        this.showPromiseReject()
      }

      this.showing = false
      if (this.value === true) {
        this.$emit('input', false)
      }

      if (this.__historyEntry) {
        History.remove(this.__historyEntry)
        this.__historyEntry = null
      }

      if (!this.__hide) {
        this.$emit('hide')
        return Promise.resolve()
      }

      this.hidePromise = new Promise((resolve, reject) => {
        this.hidePromiseResolve = () => {
          this.hidePromise = null
          this.$emit('hide')
          resolve()
        }
        this.hidePromiseReject = () => {
          this.hidePromise = null
          reject(new Error())
        }
      })

      this.__hide(evt)
      return this.hidePromise || Promise.resolve(evt)
    }
  },
  beforeDestroy () {
    if (this.showing) {
      this.showPromise && this.showPromiseReject()
      this.hidePromise && this.hidePromiseReject()
      this.$emit('input', false)
      this.__hide && this.__hide()
    }
  }
}
