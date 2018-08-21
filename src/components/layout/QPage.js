export default {
  name: 'QPage',
  inject: {
    pageContainer: {
      default () {
        console.error('QPage needs to be child of QPageContainer')
      }
    },
    layout: {}
  },
  props: {
    padding: Boolean,
    styleFn: Function
  },
  computed: {
    style () {
      const offset =
        (this.layout.header.space ? this.layout.header.size : 0) +
        (this.layout.footer.space ? this.layout.footer.size : 0)

      return typeof this.styleFn === 'function'
        ? this.styleFn(offset)
        : { height: offset ? `calc(100% - ${offset}px)` : '100%' }
    },
    classes () {
      if (this.padding) {
        return 'layout-padding'
      }
    }
  },
  render (h) {
    return h('main', {
      staticClass: 'q-layout-page',
      style: this.style,
      'class': this.classes
    }, this.$slots.default)
  }
}
