import { h, defineComponent, Transition, KeepAlive } from 'vue'

import TouchSwipe from '../directives/TouchSwipe.js'

import { hSlot } from '../utils/render.js'
import { getNormalizedVNodes } from '../utils/vm.js'

const PanelWrapper = defineComponent({
  name: 'QTabPanelWrapper',

  render () {
    return h('div', {
      class: 'q-panel scroll',
      role: 'tabpanel'
    }, hSlot(this, 'default'))
  }
})

export const PanelParentMixin = {
  props: {
    modelValue: {
      required: true
    },

    animated: Boolean,
    infinite: Boolean,
    swipeable: Boolean,
    vertical: Boolean,

    transitionPrev: String,
    transitionNext: String,

    keepAlive: Boolean
  },

  emits: [ 'update:modelValue', 'before-transition', 'transition' ],

  data () {
    return {
      panelIndex: null,
      panelTransition: null
    }
  },

  computed: {
    panelDirectives () {
      // if this.swipeable
      return [[
        TouchSwipe,
        this.__swipe,
        void 0,
        {
          horizontal: this.vertical !== true,
          vertical: this.vertical,
          mouse: true
        }
      ]]
    },

    contentKey () {
      return typeof this.modelValue === 'string' || typeof this.modelValue === 'number'
        ? this.modelValue
        : String(this.modelValue)
    },

    transitionPrevComputed () {
      return this.transitionPrev || `slide-${this.vertical === true ? 'down' : 'right'}`
    },

    transitionNextComputed () {
      return this.transitionNext || `slide-${this.vertical === true ? 'up' : 'left'}`
    }
  },

  watch: {
    modelValue (newVal, oldVal) {
      const index = this.__isValidPanelName(newVal) === true
        ? this.__getPanelIndex(newVal)
        : -1

      if (this.__forcedPanelTransition !== true) {
        this.__updatePanelTransition(
          index === -1 ? 0 : (index < this.__getPanelIndex(oldVal) ? -1 : 1)
        )
      }

      if (this.panelIndex !== index) {
        this.panelIndex = index
        this.$emit('before-transition', newVal, oldVal)
        this.$nextTick(() => {
          this.$emit('transition', newVal, oldVal)
        })
      }
    }
  },

  methods: {
    next () {
      this.__go(1)
    },

    previous () {
      this.__go(-1)
    },

    goTo (name) {
      this.$emit('update:modelValue', name)
    },

    __isValidPanelName (name) {
      return name !== void 0 && name !== null && name !== ''
    },

    __getPanelIndex (name) {
      return this.panels.findIndex(panel => {
        return panel.props.name === name &&
          panel.props.disable !== '' &&
          panel.props.disable !== true
      })
    },

    __getEnabledPanels () {
      return this.panels.filter(panel => {
        return panel.props.disable !== '' &&
          panel.props.disable !== true
      })
    },

    __updatePanelTransition (direction) {
      const val = direction !== 0 && this.animated === true && this.panelIndex !== -1
        ? 'q-transition--' + (direction === -1 ? this.transitionPrevComputed : this.transitionNextComputed)
        : null

      if (this.panelTransition !== val) {
        this.panelTransition = val
      }
    },

    __go (direction, startIndex = this.panelIndex) {
      let index = startIndex + direction
      const slots = this.panels

      while (index > -1 && index < slots.length) {
        const opt = slots[ index ]

        if (
          opt !== void 0 &&
          opt.props.disable !== '' &&
          opt.props.disable !== true
        ) {
          this.__updatePanelTransition(direction)
          this.__forcedPanelTransition = true
          this.$emit('update:modelValue', opt.props.name)
          setTimeout(() => {
            this.__forcedPanelTransition = false
          })
          return
        }

        index += direction
      }

      if (this.infinite === true && slots.length > 0 && startIndex !== -1 && startIndex !== slots.length) {
        this.__go(direction, direction === -1 ? slots.length : -1)
      }
    },

    __swipe (evt) {
      const dir = this.vertical === true ? 'up' : 'left'
      this.__go((this.$q.lang.rtl === true ? -1 : 1) * (evt.direction === dir ? 1 : -1))
    },

    __updatePanelIndex () {
      const index = this.__getPanelIndex(this.modelValue)

      if (this.panelIndex !== index) {
        this.panelIndex = index
      }

      return true
    },

    __getPanelContentChild () {
      const panel = this.__isValidPanelName(this.modelValue) &&
        this.__updatePanelIndex() &&
        this.panels[ this.panelIndex ]

      return this.keepAlive === true
        ? [
            h(KeepAlive, [
              h(PanelWrapper, { key: this.contentKey }, () => panel)
            ])
          ]
        : [
            h('div', {
              class: 'q-panel scroll',
              key: this.contentKey,
              role: 'tabpanel'
            }, [panel])
          ]
    },

    __getPanelContent () {
      if (this.panels.length === 0) {
        return
      }

      return this.animated === true
        ? [
            h(Transition, {
              name: this.panelTransition
            }, this.__getPanelContentChild)
          ]
        : this.__getPanelContentChild()
    }
  },

  render () {
    this.panels = getNormalizedVNodes(
      hSlot(this, 'default', [])
    ).filter(
      panel => panel.props !== null &&
        panel.props.slot === void 0 &&
        this.__isValidPanelName(panel.props.name)
    )

    return this.__renderPanels()
  }
}

export const PanelChildMixin = {
  props: {
    name: {
      required: true
    },
    disable: Boolean
  }
}
