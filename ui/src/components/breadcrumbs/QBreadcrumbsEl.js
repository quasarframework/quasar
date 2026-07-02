import { computed, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import useBreadcrumbsEl, {
  useBreadcrumbsElEmits,
  useBreadcrumbsElProps
} from './use-breadcrumbs-el.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/breadcrumbs
 */
/**
 * This is where custom content goes, unless 'icon' and 'label' props are not enough
 *
 * @api slot default
 */
export default createComponent({
  name: 'QBreadcrumbsEl',

  props: useBreadcrumbsElProps,

  emits: useBreadcrumbsElEmits,

  setup(props, { slots }) {
    const { linkTag, linkAttrs, linkClass, navigateOnClick } =
      useBreadcrumbsEl()

    const data = computed(() => ({
      class:
        'q-breadcrumbs__el q-link ' +
        'flex inline items-center relative-position ' +
        (props.disable
          ? 'q-breadcrumbs__el--disable'
          : 'q-link--focusable' + linkClass.value),
      ...linkAttrs.value,
      onClick: navigateOnClick
    }))

    const iconClass = computed(
      () =>
        'q-breadcrumbs__el-icon' +
        (props.label !== void 0 ? ' q-breadcrumbs__el-icon--with-label' : '')
    )

    return () => {
      const child = []

      if (props.icon !== void 0) {
        child.push(
          h(QIcon, {
            class: iconClass.value,
            name: props.icon
          })
        )
      }

      if (props.label !== void 0) child.push(props.label)

      return h(
        linkTag.value,
        { ...data.value },
        hMergeSlot(slots.default, child)
      )
    }
  }
})
