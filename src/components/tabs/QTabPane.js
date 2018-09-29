import Vue from 'vue'

export default Vue.extend({
  name: 'QTabPane',

  inject: {
    tabContent: {
      default () {
        console.error('QTabPane needs to be child of QTabsContent')
      }
    }
  },

  props: {
    name: {
      type: String,
      required: true
    },
    keepAlive: Boolean
  },

  data () {
    return {
      shown: false
    }
  },

  computed: {
    isActive () {
      return this.tabContent.current === this.name
    },

    classes () {
      if (this.isActive) {
        const dir = this.tabContent.direction
        return dir ? `animate-fade-${dir}` : null
      }
    }
  },

  render (h) {
    if (this.keepAlive) {
      if (!this.shown && !this.isActive) {
        return h('div', { staticClass: 'hidden' })
      }
      this.shown = true
    }
    else {
      this.shown = this.isActive
      if (!this.isActive) {
        return h('div', { staticClass: 'hidden' })
      }
    }

    return h('div', {
      staticClass: 'q-tab-pane',
      attrs: { role: 'tabpanel' },
      'class': this.classes
    }, this.$slots.default)
  }
})
