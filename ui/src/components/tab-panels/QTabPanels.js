import { defineComponent, computed, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'
import { usePanelParentProps, usePanelParent } from '../../composables/use-panel.js'

import { hDir } from '../../utils/render.js'

export default defineComponent({
  name: 'QTabPanels',

  props: {
    ...usePanelParentProps,
    ...useDarkProps
  },

  setup (props, { slots, emit }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const vm = getCurrentInstance()
    const { updatePanelsList, getPanelContent, panelDirectives } = usePanelParent(props, emit, $q, vm)

    const classes = computed(() =>
      'q-tab-panels q-panel-parent' +
      (isDark.value === true ? ' q-tab-panels--dark q-dark' : '')
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
