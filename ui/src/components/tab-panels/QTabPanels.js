import { computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import usePanel, { usePanelProps, usePanelEmits } from '../../composables/private/use-panel.js'

import { createComponent } from '../../utils/private/create.js'
import { hDir } from '../../utils/private/render.js'

export default createComponent({
  name: 'QTabPanels',

  props: {
    ...usePanelProps,
    ...useDarkProps
  },

  emits: usePanelEmits,

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const { updatePanelsList, getPanelContent, panelDirectives } = usePanel()

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
