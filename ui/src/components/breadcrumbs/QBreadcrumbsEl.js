import { h, defineComponent, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import { hMergeSlot } from '../../utils/private/render.js'
import useRouterLink, { useRouterLinkProps } from '../../composables/private/use-router-link.js'

export default defineComponent({
  name: 'QBreadcrumbsEl',

  props: {
    ...useRouterLinkProps,

    label: String,
    icon: String,

    tag: {
      type: String,
      default: 'span'
    }
  },

  setup (props, { slots, attrs }) {
    const vm = getCurrentInstance()
    const { linkTag, linkProps } = useRouterLink(props, vm, attrs)

    return () => {
      const child = []

      props.icon !== void 0 && child.push(
        h(QIcon, {
          class: 'q-breadcrumbs__el-icon'
            + (props.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : ''),
          name: props.icon
        })
      )

      props.label !== void 0 && child.push(props.label)

      return h(linkTag.value, {
        class: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
        ...linkProps.value
      }, hMergeSlot(slots.default, child))
    }
  }
})
