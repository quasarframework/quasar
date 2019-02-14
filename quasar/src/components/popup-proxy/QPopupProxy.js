import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import AnchorMixin from '../../mixins/anchor.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPopupProxy',

  mixins: [ AnchorMixin ],

  props: {
    value: Boolean,

    breakpoint: {
      type: [String, Number],
      default: 450
    },

    disable: Boolean
  },

  data () {
    return {
      showing: false,
      type: null
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
    toggle (evt) {
      return this[this.showing === true ? 'hide' : 'show'](evt)
    },

    show (evt) {
      if (this.disable === true || this.showing === true) {
        return
      }
      if (this.__showCondition !== void 0 && this.__showCondition(evt) !== true) {
        return
      }

      evt !== void 0 && evt.preventDefault()

      const breakpoint = parseInt(this.breakpoint, 10)

      this.showing = true
      this.type = this.$q.screen.width < breakpoint || this.$q.screen.height < breakpoint
        ? 'dialog'
        : 'menu'
    },

    hide () {
      if (this.disable === true || this.showing === false) {
        return
      }

      this.showing = false
    },

    __hide (evt) {
      this.showing = false
      this.$listeners.hide !== void 0 && this.$emit('hide', evt)
    }
  },

  render (h) {
    if (this.disable === true || this.type === null) { return }

    const slotDefault = slot(this, 'default')

    let slotProps = {}
    if (
      slotDefault !== void 0 &&
      slotDefault[0].componentOptions !== void 0 &&
      slotDefault[0].componentOptions.Ctor.options[`${this.type}ProxyProps`]
    ) {
      slotProps = slotDefault[0].componentOptions.Ctor.options[`${this.type}ProxyProps`]
    }

    const data = {
      props: Object.assign({}, slotProps, this.$attrs, {
        value: this.showing
      }),
      on: Object.assign({}, this.$listeners, {
        hide: this.__hide
      })
    }

    let component
    if (this.type === 'dialog') {
      component = QDialog
    }
    else {
      component = QMenu
      data.props.noParentEvent = true
    }

    return h(component, data, slotDefault)
  }
})
