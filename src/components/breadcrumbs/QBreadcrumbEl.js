import { QIcon } from '../icon'
import { RouterLinkMixin } from '../../utils/router-link'

export default {
  name: 'q-breadcrumb-el',
  mixins: [{ props: RouterLinkMixin.props }],
  props: {
    label: String,
    icon: String,
    color: String,
    noRipple: Boolean
  },
  computed: {
    link () {
      return this.to !== void 0
    }
  },
  render (h) {
    return h(this.link ? 'router-link' : 'span', {
      staticClass: 'q-breadcrumb-el flex inline items-center relative-position',
      props: this.link
        ? {
          to: this.to,
          exact: this.exact,
          append: this.append,
          replace: this.replace
        }
        : null
    },
    this.label || this.icon
      ? [
        this.icon ? h(QIcon, { staticClass: 'q-breacrumb-el-icon q-mr-sm', props: { name: this.icon } }) : null,
        this.label
      ]
      : [ this.$slots.default ]
    )
  }
}
