import { h, defineComponent } from 'vue'

import { mergeSlot } from '../../utils/slot.js'

import QIcon from '../icon/QIcon.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'

export default defineComponent({
  name: 'QBreadcrumbsEl',

  mixins: [ RouterLinkMixin ],

  props: {
    label: String,
    icon: String
  },

  render () {
    const child = []

    this.icon !== void 0 && child.push(
      h(QIcon, {
        class: 'q-breadcrumbs__el-icon' + (this.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : ''),
        name: this.icon
      })
    )

    this.label && child.push(this.label)

    return h(this.hasRouterLink === true ? 'router-link' : 'span', {
      class: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
      ...(this.hasRouterLink === true ? this.routerLinkProps : {})
    }, mergeSlot(child, this, 'default'))
  }
})
