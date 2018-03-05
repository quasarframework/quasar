import { QIcon } from '../icon'
import { RouterLinkMixin } from '../../utils/router-link'

export default {
  name: 'QBreadcrumbsEl',
  mixins: [{ props: RouterLinkMixin.props }],
  props: {
    label: String,
    icon: String,
    color: String
  },
  computed: {
    link () {
      return this.to !== void 0
    }
  },
  render (h) {
    return h(this.link ? 'router-link' : 'span', {
      staticClass: 'q-breadcrumbs-el flex inline items-center relative-position',
      props: this.link ? this.$props : null
    },
    this.label || this.icon
      ? [
        this.icon ? h(QIcon, { staticClass: 'q-breacrumbs-el-icon q-mr-sm', props: { name: this.icon } }) : null,
        this.label
      ]
      : [ this.$slots.default ]
    )
  }
}
