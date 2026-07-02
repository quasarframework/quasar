import { computed, watch } from 'vue'

import useRouterLink, {
  useRouterLinkProps
} from '../../composables/private.use-router-link/use-router-link.js'
import useTab, { useTabEmits, useTabProps } from './use-tab.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/tabs
 */
/**
 * Suggestion: QMenu, QTooltip
 *
 * @api slot default
 */
export default createComponent({
  name: 'QRouteTab',

  props: {
    ...useRouterLinkProps,
    ...useTabProps
  },

  emits: useTabEmits,

  setup(props, { slots, emit }) {
    const routeData = useRouterLink({
      useDisableForRouterLinkProps: false
    })

    const { renderTab, $tabs } = useTab(props, slots, emit, {
      exact: computed(() => props.exact),
      ...routeData
    })

    watch(
      () =>
        `${props.name} | ${props.exact} | ${(routeData.resolvedLink.value || {}).href}`,
      $tabs.verifyRouteModel
    )

    return () => renderTab(routeData.linkTag.value, routeData.linkAttrs.value)
  }
})
