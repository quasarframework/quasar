import TabMixin from './tab-mixin'

export default {
  name: 'q-tab',
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
      on: {
        click: this.select
      },
      directives: __THEME__ === 'mat'
        ? [{ name: 'ripple' }]
        : null
    }, this.__getTabContent(h))
  }
}
