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
    const { linkTag, linkProps, linkClass, hasRouterLink, navigateToRouterLink } = useRouterLink()

    const data = computed(() => {
      const acc = {
        class: 'q-breadcrumbs__el q-link '
          + 'flex inline items-center relative-position '
          + (props.disable !== true ? 'q-link--focusable' + linkClass.value : 'q-breadcrumbs__el--disable'),
        ...linkProps.value
      }
      if (hasRouterLink.value === true) {
        acc.onClick = navigateToRouterLink
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

      return h(
        linkTag.value,
        { ...data.value },
        hMergeSlot(slots.default, child)
      )
    }
  }
})
