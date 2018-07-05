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
      staticClass: 'q-link q-breadcrumbs-el flex inline items-center relative-position',
      props: this.to !== void 0 ? this.$props : null
    }, [
      this.icon ? h(QIcon, { staticClass: 'q-breacrumbs-el-icon q-mr-sm', props: { name: this.icon } }) : null,
      this.label
    ].concat(this.$slots.default))
  }
}
