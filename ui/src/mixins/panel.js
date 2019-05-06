import TouchSwipe from '../directives/TouchSwipe.js'
import { stop } from '../utils/event.js'

export const PanelParentMixin = {
  directives: {
    TouchSwipe
  },

  props: {
    value: {
      required: true
    },

    animated: Boolean,
    infinite: Boolean,
    swipeable: Boolean,

    transitionPrev: {
      type: String,
      default: 'slide-right'
    },
    transitionNext: {
      type: String,
      default: 'slide-left'
    }
  },

  data () {
    return {
      panelIndex: null,
      panelTransition: null
    }
  },

  computed: {
    panelDirectives () {
      if (this.swipeable) {
        return [{
          name: 'touch-swipe',
          value: this.__swipe,
          modifiers: {
            horizontal: true,
            mouse: true
          }
        }]
      }
    },

    contentKey () {
      return typeof this.value === 'string' || typeof this.value === 'number'
        ? this.value
        : String(this.value)
    }
  },

  watch: {
    value (newVal, oldVal) {
      const
        validNewPanel = this.__isValidPanelName(newVal),
        index = validNewPanel === true
          ? this.__getPanelIndex(newVal)
          : -1

      if (this.animated) {
        this.panelTransition = validNewPanel === true && this.panelIndex !== -1
          ? 'q-transition--' + (
            index < this.__getPanelIndex(oldVal)
              ? this.transitionPrev
              : this.transitionNext
          )
          : null
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
      this.$emit('input', name)
    },

    __isValidPanelName (name) {
      return name !== void 0 && name !== null && name !== ''
    },

    __getPanelIndex (name) {
      return this.panels.findIndex(panel => {
        const opt = panel.componentOptions
        return opt &&
          opt.propsData.name === name &&
          opt.propsData.disable !== '' &&
          opt.propsData.disable !== true
      })
    },

    __getAllPanels () {
      return this.panels.filter(
        panel => panel.componentOptions !== void 0 &&
          this.__isValidPanelName(panel.componentOptions.propsData.name)
      )
    },

    __getAvailablePanels () {
      return this.panels.filter(panel => {
        const opt = panel.componentOptions
        return opt &&
          opt.propsData.name !== void 0 &&
          opt.propsData.disable !== '' &&
          opt.propsData.disable !== true
      })
    },

    __go (direction, startIndex = this.panelIndex) {
      let index = startIndex + direction
      const slots = this.panels

      while (index > -1 && index < slots.length) {
        const opt = slots[index].componentOptions

        if (
          opt !== void 0 &&
          opt.propsData.disable !== '' &&
          opt.propsData.disable !== true
        ) {
          this.$emit('input', slots[index].componentOptions.propsData.name)
          return
        }

        index += direction
      }

      if (this.infinite && slots.length > 0 && startIndex !== -1 && startIndex !== slots.length) {
        this.__go(direction, direction === -1 ? slots.length : -1)
      }
    },

    __swipe (evt) {
      this.__go((this.$q.lang.rtl === true ? -1 : 1) * (evt.direction === 'left' ? 1 : -1))
    },

    __updatePanelIndex () {
      const index = this.__getPanelIndex(this.value)

      if (this.panelIndex !== index) {
        this.panelIndex = index
      }

      return true
    },

    __getPanelContent (h) {
      if (this.panels.length === 0) {
        return
      }

      const panel = this.__isValidPanelName(this.value) &&
        this.__updatePanelIndex() &&
        this.panels[this.panelIndex]

      const content = [
        h('div', {
          key: this.contentKey,
          staticClass: 'q-panel scroll',
          attrs: { role: 'tabpanel' },
          // stop propagation of content emitted @input
          // which would tamper with Panel's model
          on: { input: stop }
        }, [ panel ])
      ]

      return this.animated === true
        ? [
          h('transition', {
            props: {
              name: this.panelTransition
            }
          }, content)
        ]
        : content
    }
  },

  render (h) {
    this.panels = this.$scopedSlots.default !== void 0
      ? this.$scopedSlots.default()
      : []

    return this.__render(h)
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
