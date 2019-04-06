import History from '../history.js'

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
      if (this.disable === true && val === true) {
        this.$emit('input', false)
        return
      }

      if (val !== this.showing) {
        this[val ? 'show' : 'hide']()
      }
    }
  },

  methods: {
    toggle (evt, triggerModelChange = true) {
      this[this.showing === true ? 'hide' : 'show'](evt, triggerModelChange)
    },

    show (evt, triggerModelChange = true) {
      if (this.disable === true || this.showing === true) {
        return
      }
      if (this.__showCondition !== void 0 && this.__showCondition(evt) !== true) {
        return
      }

      if (triggerModelChange) {
        this.$emit('before-show', evt)
        this.showing = true
        this.$emit('input', true)
      }
      else {
        this.$emit('input', true)
        return
      }

      if (this.$options.modelToggle !== void 0 && this.$options.modelToggle.history === true) {
        this.__historyEntry = {
          handler: this.hide
        }
        History.add(this.__historyEntry)
      }

      if (this.__show !== void 0) {
        this.__show(evt)
      }
      else {
        this.$emit('show', evt)
      }
    },

    hide (evt, triggerModelChange = true) {
      if (this.disable === true || this.showing === false) {
        return
      }

      if (triggerModelChange) {
        this.$emit('before-hide', evt)
        this.showing = false
        this.value !== false && this.$emit('input', false)
      }
      else {
        this.value !== false && this.$emit('input', false)
        return
      }

      this.__removeHistory()

      if (this.__hide !== void 0) {
        this.__hide(evt)
      }
      else {
        this.$emit('hide', evt)
      }
    },

    __removeHistory () {
      if (this.__historyEntry !== void 0) {
        History.remove(this.__historyEntry)
        this.__historyEntry = void 0
      }
    }
  },

  beforeDestroy () {
    this.showing === true && this.__removeHistory()
  }
}
