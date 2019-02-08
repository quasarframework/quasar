import Vue from 'vue'

import slot from '../../utils/slot.js'

import QIcon from '../icon/QIcon.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'

export default Vue.extend({
  name: 'QBreadcrumbsEl',

  mixins: [ RouterLinkMixin ],

  props: {
    label: String,
    icon: String
  },

  render (h) {
    return h(this.hasRouterLink ? 'router-link' : 'span', {
      staticClass: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
      props: this.hasRouterLink ? this.routerLinkProps : null
    }, [

      this.icon !== void 0
        ? h(QIcon, {
          staticClass: 'q-breadcrumbs__el-icon',
          class: this.label !== void 0 ? 'q-breadcrumbs__el-icon--with-label' : null,
          props: { name: this.icon }
        })
        : null,

      this.label

    ].concat(slot(this, 'default')))
  }
})
