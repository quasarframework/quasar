import { h, defineComponent } from 'vue'

import { hMergeSlot } from '../../utils/render.js'

import QIcon from '../icon/QIcon.js'

import RouterLinkMixin from '../../mixins/router-link.js'

export default defineComponent({
  name: 'QBreadcrumbsEl',

  mixins: [RouterLinkMixin],

  props: {
    label: String,
    icon: String,

    tag: {
      type: String,
      default: 'span'
    }
  },

  render () {
    const child = []

    this.icon !== void 0 && child.push(
      h(QIcon, {
        class: 'q-breadcrumbs__el-icon' +
          (this.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : ''),
        name: this.icon
      })
    )

    this.label !== void 0 && child.push(this.label)

    return h(this.linkTag, {
      class: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
      ...this.linkProps
    }, hMergeSlot(this, 'default', child))
  }
})
