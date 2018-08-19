import TabMixin from './tab-mixin.js'

export default {
  name: 'QTab',
  mixins: [TabMixin],
  props: {
    default: Boolean
  },
  methods: {
    select () {
      this.$emit('click', this.name)
      if (!this.disable) {
        this.selectTab(this.name)
      }
    }
  },
  mounted () {
    if (this.default && !this.disable) {
      this.select()
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      attrs: { 'data-tab-name': this.name },
      on: {
        click: this.select,
        keyup: e => e.keyCode === 13 && this.select(e)
      },
      directives: process.env.THEME === 'mat'
        ? [{ name: 'ripple' }]
        : null
    }, this.__getTabContent(h))
  }
}
