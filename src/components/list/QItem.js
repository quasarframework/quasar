import { ItemMixin, itemClasses } from './list-utils'
import { RouterLinkMixin } from '../../utils/router-link'

export default {
  name: 'q-item',
  functional: true,
  mixins: [ItemMixin, {props: RouterLinkMixin.props}],
  props: {
    active: Boolean,
    link: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props,
      cls = itemClasses(prop)

    if (prop.to !== void 0 || prop.link) {
      data.props = prop
    }
    else {
      cls.active = prop.active
    }

    data.class = data.class ? [data.class, cls] : cls

    return h(prop.to ? 'router-link' : prop.tag, data, ctx.children)
  }
}
