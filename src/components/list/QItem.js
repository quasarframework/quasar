import { ItemMixin, itemClasses } from './list-utils'
import { RouterLinkMixin } from '../../utils/router-link'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-item',
  functional: true,
  mixins: [ItemMixin, {props: RouterLinkMixin.props}],
  directives: {
    Ripple
  },
  props: {
    active: Boolean,
    link: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props,
      cls = itemClasses(prop)

    if (prop.to !== void 0) {
      data.props = prop
      data.directives = data.directives || []
      data.directives.push({
        name: 'ripple',
        modifiers: {
          mat: true
        }
      })
    }
    else {
      cls.active = prop.active
    }

    data.class = data.class ? [data.class, cls] : cls

    return h(prop.to ? 'router-link' : prop.tag, data, ctx.children)
  }
}
