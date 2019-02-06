import TouchSwipe from '../directives/TouchSwipe'

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
            horizontal: true
          }
        }]
      }
    }
  },

  watch: {
    value (newVal, oldVal) {
      const index = newVal ? this.__getPanelIndex(newVal) : -1

      if (this.animated) {
        this.panelTransition = newVal && this.panelIndex !== -1
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

    __getPanelIndex (name) {
      return this.panels.findIndex(panel => {
        const opt = panel.componentOptions
        return opt &&
          opt.propsData.name === name &&
          opt.propsData.disable !== '' &&
          opt.propsData.disable !== false
      })
    },

    __getAllPanels () {
      return this.panels.filter(
        panel => panel.componentOptions !== void 0 && panel.componentOptions.propsData.name !== void 0
      )
    },

    __getAvailablePanels () {
      return this.panels.filter(panel => {
        const opt = panel.componentOptions
        return opt &&
          opt.propsData.name !== void 0 &&
          opt.propsData.disable !== '' &&
          opt.propsData.disable !== false
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
      this.__go(evt.direction === 'left' ? 1 : -1)
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

      const panel = this.value &&
        this.__updatePanelIndex() &&
        this.panels[this.panelIndex]

      return [
        this.animated ? h('transition', {
          props: {
            name: this.panelTransition
          }
        }, [
          h('div', {
            key: this.value,
            staticClass: 'q-panel'
          }, [ panel ])
        ]) : panel
      ]
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
