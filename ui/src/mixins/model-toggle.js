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
      this.__processModelChange(val)
    },

    $route () {
      this.navigationHideCondition === true && this.hide()
    }
  },

  computed: {
    navigationHideCondition () {
      return this.persistent !== true
    }
  },

  methods: {
    toggle (evt) {
      this[this.showing === true ? 'hide' : 'show'](evt)
    },

    show (evt) {
      if (this.disable === true || this.showing === true) {
        return
      }
      if (this.__showCondition !== void 0 && this.__showCondition(evt) !== true) {
        return
      }

      const fn = typeof this.$listeners.input === 'function'
        ? () => { this.value !== true && this.$emit('input', true) }
        : () => { this.__processShow(evt) }

      if (this.$q.platform.is.ie === true) {
        // IE sometimes performs a focus on body after click;
        // the delay prevents the click-outside to trigger on this focus
        setTimeout(fn, 0)
      }
      else {
        fn()
      }
    },

    __processShow (evt) {
      if (this.showing === true) {
        return
      }

      this.showing = true

      this.$emit('before-show', evt)

      if (this.$options.modelToggle !== void 0 && this.$options.modelToggle.history === true) {
        this.__historyEntry = {
          condition: () => { return this.navigationHideCondition },
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

    hide (evt) {
      if (this.disable === true || this.showing === false) {
        return
      }

      if (typeof this.$listeners.input === 'function') {
        this.value !== false && this.$emit('input', false)
      }
      else {
        this.__processHide(evt)
      }
    },

    __processHide (evt) {
      if (this.showing === false) {
        return
      }

      this.showing = false

      this.$emit('before-hide', evt)

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
    },

    __processModelChange (val) {
      if (this.disable === true && val === true) {
        this.$emit('input', false)
      }
      else if (val !== this.showing) {
        this[val ? '__processShow' : '__processHide']()
      }
    }
  },

  mounted () {
    this.__processModelChange(this.value)
  },

  beforeDestroy () {
    this.showing === true && this.__removeHistory()
  }
}
