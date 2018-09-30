import Vue from 'vue'

export default Vue.extend({
  name: 'QTabsContent',

  props: {
    value: { required: true },
    swipeable: Boolean,
    animated: Boolean
  },

  data () {
    return {
      tab: this.value,
      direction: null
    }
  },

  watch: {
    value (newVal, oldVal) {
      this.tab = newVal

      if (this.animated) {
        this.direction = newVal && oldVal
          ? (
            this.__getIndex(newVal) < this.__getIndex(oldVal)
              ? 'left'
              : 'right'
          )
          : null
      }
    }
  },

  methods: {
    previous () {
      this.__go(-1)
    },

    next () {
      this.__go(1)
    },

    __swipe (evt) {
      this.__go(evt.direction === 'left' ? 1 : -1)
    },

    __getIndex (name) {
      return this.$slots.default.findIndex(
        pane => pane.componentOptions && pane.componentOptions.propsData.name === name
      )
    },

    __go (offset) {
      let index = (this.value ? this.__getIndex(this.value) : -1) + offset
      const slots = this.$slots.default

      while (index > -1 && index < slots.length) {
        const opt = slots[index].componentOptions

        if (opt && opt.propsData.disable !== '' && opt.propsData.disable !== true) {
          this.$emit('input', slots[index].componentOptions.propsData.name)
          break
        }

        index += offset
      }
    }
  },

  render (h) {
    const pane = this.tab && this.$slots.default[ this.__getIndex(this.tab) ]

    return h('div', {
      staticClass: 'q-tabs-content relative-position',
      directives: this.swipeable ? [{
        name: 'touch-swipe',
        value: this.__swipe
      }] : null
    }, pane ? [
      this.animated ? h('transition', {
        props: { name: 'q-transition--slide-' + this.direction }
      }, [
        h('div', { key: this.tab, staticClass: 'q-tabs-content__animator q-transition--slide' }, [ pane ])
      ]) : pane
    ] : null)
  }
})
