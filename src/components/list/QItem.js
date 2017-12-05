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
      link = prop.to !== void 0,
      cls = itemClasses(prop)

    if (link) {
      data.props = prop
    }
    else {
      cls.active = prop.active
    }

    data.class = data.class ? [data.class, cls] : cls

    return h(link ? 'router-link' : prop.tag, data, ctx.children)
  }
}
