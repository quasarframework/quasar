import { h, computed } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private/create.js'
import { hMergeSlot } from '../../utils/private/render.js'
import useRouterLink, { useRouterLinkProps } from '../../composables/private/use-router-link.js'

export default createComponent({
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

  setup (props, { slots }) {
    const { linkTag, linkProps, hasLink, navigateToLink } = useRouterLink()

    const data = computed(() => {
      const acc = { ...linkProps.value }
      if (hasLink.value === true) {
        acc.onClick = navigateToLink
      }
      return acc
    })

    const iconClass = computed(() =>
      'q-breadcrumbs__el-icon'
      + (props.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : '')
    )

    return () => {
      const child = []

      props.icon !== void 0 && child.push(
        h(QIcon, {
          class: iconClass.value,
          name: props.icon
        })
      )

      props.label !== void 0 && child.push(props.label)

      return h(linkTag.value, {
        class: 'q-breadcrumbs__el q-link flex inline items-center relative-position',
        ...data.value
      }, hMergeSlot(slots.default, child))
    }
  }
})
