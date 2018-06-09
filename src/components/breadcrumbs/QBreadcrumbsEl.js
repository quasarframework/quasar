import { QIcon } from '../icon'
import { routerLinkProps } from '../../utils/router-link'

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
      staticClass: 'q-link q-breadcrumbs-el flex inline items-center relative-position',
      props: this.to !== void 0 ? this.$props : null
    },
    this.label || this.icon
      ? [
        this.icon ? h(QIcon, { staticClass: 'q-breacrumbs-el-icon q-mr-sm', props: { name: this.icon } }) : null,
        this.label
      ]
      : this.$slots.default
    )
  }
}
