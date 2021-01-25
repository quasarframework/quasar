import { defineComponent, computed, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import usePanel, { usePanelProps } from '../../composables/private/use-panel.js'

import { hDir } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QTabPanels',

  props: {
    ...usePanelProps,
    ...useDarkProps
  },

  setup (props, { slots, emit }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const vm = getCurrentInstance()
    const { updatePanelsList, getPanelContent, panelDirectives } = usePanel(props, emit, $q, vm)

    const classes = computed(() =>
      'q-tab-panels q-panel-parent'
      + (isDark.value === true ? ' q-tab-panels--dark q-dark' : '')
    )

    return () => {
      updatePanelsList(slots)

      return hDir(
        'div',
        { class: classes.value },
        getPanelContent(),
        'pan',
        props.swipeable,
        () => panelDirectives.value
      )
    }
  }
})
