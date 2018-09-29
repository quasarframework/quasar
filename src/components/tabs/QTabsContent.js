import Vue from 'vue'

export default Vue.extend({
  name: 'QTabsContent',

  provide () {
    return {
      tabContent: this.tab
    }
  },

  props: {
    value: { required: true },
    swipeable: Boolean,
    animated: Boolean
  },

  data () {
    return {
      tab: {
        current: this.value,
        direction: null
      }
    }
  },

  watch: {
    value (newVal, oldVal) {
      this.tab.current = newVal

      if (this.animated) {
        this.tab.direction = newVal && oldVal
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

    __getIndex (name) {
      const ref = this.$children.find(pane => pane.name === name)
      return ref
        ? Array.prototype.indexOf.call(this.$el.children, ref.$el)
        : -1
    },

    __go (offset) {
      const index = (this.value ? this.__getIndex(this.value) : -1) + offset

      if (index > -1 && index < this.$children.length) {
        const
          el = this.$el.children[index],
          ref = this.$children.find(pane => pane.$el === el)

        if (ref) {
          this.$emit('input', ref.name)
        }
      }
    },

    __swipe (evt) {
      this.__go(evt.direction === 'left' ? 1 : -1)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-tabs-content',
      directives: this.swipeable
        ? [{
          name: 'touch-swipe',
          value: this.__swipe
        }]
        : null
    }, this.$slots.default)
  }
})
