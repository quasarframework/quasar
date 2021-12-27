import Vue from 'vue'

import { mergeSlot } from '../../utils/slot.js'
import ListenersMixin from '../../mixins/listeners.js'
import RouterLinkMixin from '../../mixins/router-link.js'

import QIcon from '../icon/QIcon.js'

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
      return {
        staticClass: 'q-breadcrumbs__el q-link ' +
          'flex inline items-center relative-position ' +
          (this.disable !== true ? 'q-link--focusable' : 'q-breadcrumbs__el--disabled'),
        ...this.linkProps,
        [this.hasRouterLink === true ? 'nativeOn' : 'on']: { ...this.qListeners }
      }
    }
  },

  beforeCreate () {
    this.fallbackTag = 'span'
  },

  render (h) {
    const child = []

    this.icon !== void 0 && child.push(
      h(QIcon, {
        class: this.iconClass,
        props: { name: this.icon }
      })
    )

    this.label !== void 0 && child.push(this.label)

    return h(this.linkTag, this.renderData, mergeSlot(child, this, 'default'))
  }
})
