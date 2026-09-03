import { computed, h, withDirectives } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import usePanel, {
  usePanelEmits,
  usePanelProps
} from '../../composables/private.use-panel/use-panel.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QTabPanels',

  props: {
    ...usePanelProps,
    ...useDarkProps
  },

  emits: usePanelEmits,

  setup(props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const { updatePanelsList, getPanelContent, panelDirectives } = usePanel()

    const classes = computed(
      () =>
        'q-tab-panels q-panel-parent' +
        (isDark() ? ' q-tab-panels--dark q-dark' : '')
    )

    return () => {
      updatePanelsList(slots)

      return withDirectives(
        h('div', { class: classes.value }, getPanelContent()),
        panelDirectives.value
      )
    }
  }
})
