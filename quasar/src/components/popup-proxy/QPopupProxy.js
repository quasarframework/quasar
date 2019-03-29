import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import AnchorMixin from '../../mixins/anchor.js'
import { prevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPopupProxy',

  mixins: [ AnchorMixin ],

  props: {
    value: Boolean,

    breakpoint: {
      type: [String, Number],
      default: 450
    }
  },

  data () {
    return {
      showing: false,
      type: null
    }
  },

  watch: {
    value (val) {
      if (val !== this.showing) {
        this[val ? 'show' : 'hide']()
      }
    }
  },

  methods: {
    toggle (evt) {
      if (evt === void 0 || evt.defaultPrevented !== true) {
        this[this.showing === true ? 'hide' : 'show'](evt)
      }
    },

    show (evt) {
      if (
        this.showing === true ||
        (this.__showCondition !== void 0 && this.__showCondition(evt) !== true)
      ) {
        return
      }

      evt !== void 0 && prevent(evt)

      const breakpoint = parseInt(this.breakpoint, 10)

      this.showing = true
      this.$emit('input', true)

      this.type = this.$q.screen.width < breakpoint || this.$q.screen.height < breakpoint
        ? 'dialog'
        : 'menu'
    },

    hide () {
      if (this.showing === false) {
        return
      }

      this.showing = false
      this.$emit('input', false)
    },

    __hide (evt) {
      this.showing = false
      this.$emit('input', false)

      this.$listeners.hide !== void 0 && this.$emit('hide', evt)
    }
  },

  render (h) {
    if (this.type === null) {
      return
    }

    const child = slot(this, 'default')

    let props = (
      this.type === 'menu' &&
      child !== void 0 &&
      child[0] !== void 0 &&
      child[0].componentOptions !== void 0 &&
      child[0].componentOptions.Ctor !== void 0 &&
      child[0].componentOptions.Ctor.sealedOptions !== void 0 &&
      ['QDate', 'QTime', 'QCarousel', 'QColor'].includes(
        child[0].componentOptions.Ctor.sealedOptions.name
      )
    ) ? { cover: true, maxHeight: '99vh' } : {}

    const data = {
      props: Object.assign(props, this.$attrs, {
        value: this.showing
      }),
      on: {
        ...this.$listeners,
        hide: this.__hide
      }
    }

    let component

    if (this.type === 'dialog') {
      component = QDialog
    }
    else {
      component = QMenu
      data.props.noParentEvent = true
    }

    return h(component, data, slot(this, 'default'))
  }
})
