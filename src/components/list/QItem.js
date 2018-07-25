import ItemMixin from '../../mixins/item.js'
import { routerLinkProps } from '../../utils/router-link.js'

export default {
  name: 'QItem',
  mixins: [
    ItemMixin, { props: routerLinkProps }
  ],
  props: {
    active: Boolean,
    link: Boolean
  },
  computed: {
    classes () {
      return [
        this.to !== void 0
          ? 'q-link'
          : {active: this.active},
        this.itemClasses
      ]
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
