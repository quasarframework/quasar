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
      if (this.disable === true || (this.__showCondition !== void 0 && this.__showCondition(evt) !== true)) {
        return
      }

      const listener = this.$.vnode.props['onUpdate:modelValue'] !== void 0

      if (listener === true && isSSR === false) {
        this.$emit('update:modelValue', true)
        this.payload = evt
        this.$nextTick(() => {
          if (this.payload === evt) {
            this.payload = void 0
          }
        })
      }

      if (this.modelValue === null || listener === false || isSSR === true) {
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

      const listener = this.$.vnode.props['onUpdate:modelValue'] !== void 0

      if (listener === true && isSSR === false) {
        this.$emit('update:modelValue', false)
        this.payload = evt
        this.$nextTick(() => {
          if (this.payload === evt) {
            this.payload = void 0
          }
        })
      }

      if (this.modelValue === null || listener === false || isSSR === true) {
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
        this.$.vnode.props['onUpdate:modelValue'] !== void 0 && this.$emit('update:modelValue', false)
      }
      else if ((val === true) !== this.showing) {
        this[`__process${val === true ? 'Show' : 'Hide'}`](this.payload)
      }
    }
  }
}
