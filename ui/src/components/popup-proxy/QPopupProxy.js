import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import AnchorMixin from '../../mixins/anchor.js'
import { slot } from '../../utils/slot.js'
import AttrsMixin from '../../mixins/attrs.js'
import ListenersMixin from '../../mixins/listeners.js'

export default Vue.extend({
  name: 'QPopupProxy',

  mixins: [ AttrsMixin, ListenersMixin, AnchorMixin ],

  props: {
    breakpoint: {
      type: [String, Number],
      default: 450
    }
  },

  data () {
    const breakpoint = parseInt(this.breakpoint, 10)
    return {
      type: this.$q.screen.width < breakpoint || this.$q.screen.height < breakpoint
        ? 'dialog'
        : 'menu'
    }
  },

  computed: {
    parsedBreakpoint () {
      return parseInt(this.breakpoint, 10)
    },

    onEvents () {
      return {
        ...this.qListeners,
        hide: this.__onHide
      }
    }
  },

  watch: {
    '$q.screen.width' (width) {
      if (this.$refs.popup.showing !== true) {
        this.__updateType(width, this.$q.screen.height, this.parsedBreakpoint)
      }
    },

    '$q.screen.height' (height) {
      if (this.$refs.popup.showing !== true) {
        this.__updateType(this.$q.screen.width, height, this.parsedBreakpoint)
      }
    },

    breakpoint (breakpoint) {
      if (this.$refs.popup.showing !== true) {
        this.__updateType(this.$q.screen.width, this.$q.screen.height, parseInt(breakpoint, 10))
      }
    }
  },

  methods: {
    toggle (evt) {
      this.$refs.popup.toggle(evt)
    },

    show (evt) {
      this.$refs.popup.show(evt)
    },

    hide (evt) {
      this.$refs.popup.hide(evt)
    },

    __onHide (evt) {
      this.__updateType(this.$q.screen.width, this.$q.screen.height, this.parsedBreakpoint)
      this.$emit('hide', evt)
    },

    __updateType (width, height, breakpoint) {
      const type = width < breakpoint || height < breakpoint
        ? 'dialog'
        : 'menu'

      if (this.type !== type) {
        this.type = type
      }
    }
  },

  render (h) {
    const def = slot(this, 'default')

    const props = (
      this.type === 'menu' &&
      def !== void 0 &&
      def[0] !== void 0 &&
      def[0].componentOptions !== void 0 &&
      def[0].componentOptions.Ctor !== void 0 &&
      def[0].componentOptions.Ctor.sealedOptions !== void 0 &&
      ['QDate', 'QTime', 'QCarousel', 'QColor'].includes(
        def[0].componentOptions.Ctor.sealedOptions.name
      )
    ) ? { cover: true, maxHeight: '99vh' } : {}

    const data = {
      ref: 'popup',
      props: { ...props, ...this.qAttrs },
      on: this.onEvents
    }

    let component

    if (this.type === 'dialog') {
      component = QDialog
    }
    else {
      component = QMenu
      data.props.target = this.target
      data.props.contextMenu = this.contextMenu
      data.props.noParentEvent = true
      data.props.separateClosePopup = true
    }

    return h(component, data, def)
  }
})
