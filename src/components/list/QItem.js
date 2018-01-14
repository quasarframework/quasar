import { ItemMixin, itemClasses } from './list-utils'
import { RouterLinkMixin } from '../../utils/router-link'

export default {
  name: 'q-item',
  mixins: [
    ItemMixin,
    { props: RouterLinkMixin.props }
  ],
  props: {
    active: Boolean,
    link: Boolean
  },
  computed: {
    classes () {
      const cls = itemClasses(this.$props)
      return this.to !== void 0
        ? cls
        : [{active: this.active}, cls]
    }
  },
  render (h) {
    return this.to !== void 0
      ? h('router-link', { props: this.$props, 'class': this.classes }, [ this.$slots.default ])
      : h(this.tag, { 'class': this.classes }, [ this.$slots.default ])
  }
}
