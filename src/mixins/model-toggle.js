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
        console.log(this.$options.name, '__updateModel value watcher -- disabled, emitting false')
        this.$emit('input', false)
        return
      }

      console.log(this.$options.name, '__updateModel value watcher', val, this.showing)
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

      console.log('MODEL-TOGGLE show')
      if (this.showing) {
        console.log('MODEL-TOGGLE already showing/showed')
        return this.showPromise || Promise.resolve(evt)
      }

      if (this.hidePromise) {
        console.log('MODEL-TOGGLE rejecting hide promise')
        this.hidePromiseReject()
      }

      this.showing = true
      if (this.value === false) {
        console.log('MODEL-TOGGLE emitting true')
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
          console.log('MODEL-TOGGLE showPromiseResolve')
          this.showPromise = null
          this.$emit('show')
          resolve(evt)
        }
        this.showPromiseReject = () => {
          console.log('MODEL-TOGGLE showPromiseReject')
          this.showPromise = null
          reject(new Error())
        }
      })

      console.log('MODEL-TOGGLE calling __show')
      this.__show(evt)
      return this.showPromise || Promise.resolve(evt)
    },
    hide (evt) {
      if (this.disable) {
        return Promise.reject(new Error())
      }

      console.log('MODEL-TOGGLE hide')
      if (!this.showing) {
        console.log('MODEL-TOGGLE already hiding/hidden')
        return this.hidePromise || Promise.resolve()
      }

      if (this.showPromise) {
        console.log('MODEL-TOGGLE rejecting show promise')
        this.showPromiseReject()
      }

      this.showing = false
      if (this.value === true) {
        console.log('MODEL-TOGGLE emitting false')
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
          console.log('MODEL-TOGGLE hidePromiseResolve')
          this.hidePromise = null
          this.$emit('hide')
          resolve()
        }
        this.hidePromiseReject = () => {
          console.log('MODEL-TOGGLE hidePromiseReject')
          this.hidePromise = null
          reject(new Error())
        }
      })

      console.log('MODEL-TOGGLE calling __hide')
      this.__hide(evt)
      return this.hidePromise || Promise.resolve()
    }
  },
  beforeDestroy () {
    if (this.showing) {
      console.log('MODEL-TOGGLE beforeDestroy calling hide')
      this.showPromise && this.showPromiseReject()
      this.hidePromise && this.hidePromiseReject()
      this.$emit('input', false)
      this.__hide && this.__hide()
    }
  }
}
