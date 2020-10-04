import { h, defineComponent } from 'vue'

import QDialog from '../dialog/QDialog.js'
import QMenu from '../menu/QMenu.js'

import AnchorMixin from '../../mixins/anchor.js'
import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QPopupProxy',

  mixins: [ AnchorMixin ],

  props: {
    breakpoint: {
      type: [ String, Number ],
      default: 450
    }
  },

  emits: [ 'hide' ],

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
    }
  },

  watch: {
    '$q.screen.width': '__updateTypeWithGuard',
    '$q.screen.height': '__updateTypeWithGuard',
    parsedBreakpoint: '__updateTypeWithGuard'
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
      this.__updateType()
      this.$emit('hide', evt)
    },

    __updateType () {
      const type = this.$q.screen.width < this.parsedBreakpoint || this.$q.screen.height < this.parsedBreakpoint
        ? 'dialog'
        : 'menu'

      if (this.type !== type) {
        this.type = type
      }
    },

    __updateTypeWithGuard () {
      if (this.$refs.popup.showing !== true) {
        this.__updateType()
      }
    }
  },

  render () {
    const def = hSlot(this, 'default')

    const props = (
      this.type === 'menu' &&
      def !== void 0 &&
      def[0] !== void 0 &&
      def[0].type !== void 0 &&
      ['QDate', 'QTime', 'QCarousel', 'QColor'].includes(
        def[0].type.name
      )
    ) ? { cover: true, maxHeight: '99vh' } : {}

    const data = {
      ref: 'popup',
      ...props,
      ...this.$attrs,
      onHide: this.__onHide
    }

    let component

    if (this.type === 'dialog') {
      component = QDialog
    }
    else {
      component = QMenu
      data.target = this.target
      data.contextMenu = this.contextMenu
      data.noParentEvent = true
      data.separateClosePopup = true
    }

    return h(component, data, () => def)
  }
})
