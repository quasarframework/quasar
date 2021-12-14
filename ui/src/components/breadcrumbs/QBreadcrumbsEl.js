import Vue from 'vue'

import { mergeSlot } from '../../utils/slot.js'
import ListenersMixin from '../../mixins/listeners.js'

import QIcon from '../icon/QIcon.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'

export default Vue.extend({
  name: 'QBreadcrumbsEl',

  mixins: [ ListenersMixin, RouterLinkMixin ],

  props: {
    label: String,
    icon: String
  },

  computed: {
    iconClass () {
      return 'q-breadcrumbs__el-icon' +
        (this.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : '')
    },

    renderData () {
      const staticClass = 'q-breadcrumbs__el q-link ' +
        'flex inline items-center relative-position ' +
        (this.disable !== true ? 'q-link--focusable' : 'q-breadcrumbs__el--disabled')

      return this.hasRouterLink === true
        ? [ 'router-link', { staticClass, props: this.routerLinkProps, nativeOn: { ...this.qListeners } } ]
        : [ 'span', { staticClass, on: { ...this.qListeners } } ]
    }
  },

  render (h) {
    const child = []

    this.icon !== void 0 && child.push(
      h(QIcon, {
        staticClass: this.iconClass,
        props: { name: this.icon }
      })
    )

    this.label && child.push(this.label)

    return h(...this.renderData, mergeSlot(child, this, 'default'))
  }
})
