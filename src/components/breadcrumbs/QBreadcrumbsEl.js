import QIcon from '../icon/QIcon.js'
import { routerLinkProps } from '../../utils/router-link.js'

export default {
  name: 'QBreadcrumbsEl',
  mixins: [{ props: routerLinkProps }],
  props: {
    label: String,
    icon: String,
    color: String
  },
  render (h) {
    return h(this.to !== void 0 ? 'router-link' : 'span', {
      staticClass: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
      props: this.to !== void 0 ? this.$props : null
    }, [
      (this.icon && h(QIcon, {
        staticClass: 'q-mr-sm',
        props: { name: this.icon }
      })) || void 0,
      this.label
    ].concat(this.$slots.default))
  }
}
