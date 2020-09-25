import { isSSR } from '../plugins/Platform.js'

import TimeoutMixin from './timeout.js'

export default {
  mixins: [ TimeoutMixin ],

  props: {
    modelValue: {
      type: Boolean,
      default: null
    }
  },

  emits: [ 'update:modelValue', 'before-show', 'show', 'before-hide', 'hide' ],

  data () {
    return {
      showing: false
    }
  },

  watch: {
    modelValue (val) {
      this.__processModelChange(val)
    },

    $route () {
      this.hideOnRouteChange === true && this.showing === true && this.hide()
    }
  },

  methods: {
    toggle (evt) {
      this[this.showing === true ? 'hide' : 'show'](evt)
    },

    show (evt) {
      if (isSSR === true || this.disable === true || (this.__showCondition !== void 0 && this.__showCondition(evt) !== true)) {
        return
      }

      if (this.modelValue === false) {
        this.$emit('update:modelValue', true)
        this.payload = evt
        this.$nextTick(() => {
          if (this.payload === evt) {
            this.payload = void 0
          }
        })
      }
      else if (this.modelValue === null) {
        this.__processShow(evt)
      }
    },

    __processShow (evt) {
      if (this.showing === true) {
        return
      }

      this.showing = true

      this.$emit('before-show', evt)

      if (this.__show !== void 0) {
        this.__clearTick()
        this.__show(evt)
        this.__prepareTick()
      }
      else {
        this.$emit('show', evt)
      }
    },

    hide (evt) {
      if (isSSR === true || this.disable === true) {
        return
      }

      if (this.modelValue === true) {
        this.$emit('update:modelValue', false)
        this.payload = evt
        this.$nextTick(() => {
          if (this.payload === evt) {
            this.payload = void 0
          }
        })
      }
      else if (this.modelValue === null) {
        this.__processHide(evt)
      }
    },

    __processHide (evt) {
      if (this.showing === false) {
        return
      }

      this.showing = false

      this.$emit('before-hide', evt)

      if (this.__hide !== void 0) {
        this.__clearTick()
        this.__hide(evt)
        this.__prepareTick()
      }
      else {
        this.$emit('hide', evt)
      }
    },

    __processModelChange (val) {
      if (this.disable === true && val === true) {
        this.modelValue !== null && this.$emit('update:modelValue', false)
      }
      else if ((val === true) !== this.showing) {
        this[`__process${val === true ? 'Show' : 'Hide'}`](this.payload)
      }
    }
  }
}
