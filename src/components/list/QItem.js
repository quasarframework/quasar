import ItemMixin from '../../mixins/item'
import { routerLinkProps } from '../../utils/router-link'

export default {
  name: 'QItem',
  mixins: [
    ItemMixin,
    { props: routerLinkProps }
  ],
  props: {
    active: Boolean,
    link: Boolean
  },
  computed: {
    classes () {
      const cls = this.itemClasses
      return this.to !== void 0
        ? ['q-link', cls]
        : [{active: this.active}, cls]
    }
  },
  render (h) {
    if (this.to !== void 0) {
      return h('router-link', {
        props: Object.assign({}, this.$props, { tag: 'a' }),
        'class': this.classes
      }, this.$slots.default)
    }

    return h(
      this.tag,
      { 'class': this.classes },
      this.$slots.default
    )
  }
}
