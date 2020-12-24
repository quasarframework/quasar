import { defineComponent, computed, watch, getCurrentInstance } from 'vue'

import useRouterLink, { useRouterLinkProps } from '../../composables/private/use-router-link.js'
import useTab, { useTabProps, useTabEmits } from './use-tab.js'

export default defineComponent({
  name: 'QRouteTab',

  props: {
    ...useRouterLinkProps,
    ...useTabProps,
    to: { required: true }
  },

  emits: useTabEmits,

  setup (props, { slots, emit, attrs }) {
    const vm = getCurrentInstance()

    const { hasLink, linkTag, linkProps, linkRoute, navigateToLink, linkIsExactActive, linkIsActive } = useRouterLink(props, vm, attrs)
    const exact = computed(() => props.exact)
    const { renderTab, $tabs } = useTab(props, slots, emit, { exact, hasLink, navigateToLink, linkRoute, linkIsExactActive, linkIsActive })

    watch(() => props.name + props.exact + (linkRoute.value || {}).href, () => {
      $tabs.verifyRouteModel()
    })

    return () => renderTab(linkTag.value, linkProps.value)
  }
})
