export const PanelParentMixin = {
  props: {
    value: {
      type: String,
      required: true
    },
    animated: Boolean
  },

  data () {
    return {
      panelIndex: null,
      panelDirection: null
    }
  },

  watch: {
    value (newVal, oldVal) {
      const index = newVal ? this.__getPanelIndex(newVal) : -1

      if (this.animated) {
        this.panelDirection = newVal && this.panelIndex !== -1
          ? (
            index < this.__getPanelIndex(oldVal)
              ? 'left'
              : 'right'
          )
          : null
      }

      if (this.panelIndex !== index) {
        this.panelIndex = index
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
      return this.$slots.default.findIndex(
        panel => panel.componentOptions && panel.componentOptions.propsData.name === name
      )
    },

    __go (direction) {
      let index = this.panelIndex + direction
      const slots = this.$slots.default

      while (index > -1 && index < slots.length) {
        const opt = slots[index].componentOptions

        if (opt && opt.propsData.disable !== '' && opt.propsData.disable !== true) {
          this.$emit('input', slots[index].componentOptions.propsData.name)
          break
        }

        index += direction
      }
    },

    __updatePanelIndex () {
      const index = this.__getPanelIndex(this.value)

      if (this.panelIndex !== index) {
        this.panelIndex = index
      }

      return true
    },

    __getPanelContent (h) {
      const panel = this.value &&
        this.__updatePanelIndex() &&
        this.$slots.default[this.panelIndex]

      return panel ? [
        this.animated ? h('transition', {
          props: {
            name: this.panelDirection
              ? 'q-transition--slide-' + this.panelDirection
              : null
          }
        }, [
          h('div', { key: this.value, staticClass: 'q-transition--slide' }, [ panel ])
        ]) : panel
      ] : null
    },

    __getPanels () {
      return this.$slots.default.filter(
        panel => panel.componentOptions && panel.componentOptions.propsData.name
      )
    }
  }
}

export const PanelChildMixin = {
  props: {
    name: {
      type: String,
      required: true
    },
    disable: Boolean
  }
}
