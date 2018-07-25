export default {
  name: 'QList',
  props: {
    noBorder: Boolean,
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    striped: Boolean,
    stripedOdd: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    link: Boolean
  },
  computed: {
    classes () {
      return {
        'no-border': this.noBorder,
        'q-list-dark': this.dark,
        'q-list-dense': this.dense,
        'q-list-sparse': this.sparse,
        'q-list-striped': this.striped,
        'q-list-striped-odd': this.stripedOdd,
        'q-list-separator': this.separator,
        'q-list-inset-separator': this.insetSeparator,
        'q-list-multiline': this.multiline,
        'q-list-highlight': this.highlight,
        'q-list-link': this.link
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-list',
      'class': this.classes
    }, this.$slots.default)
  }
}
