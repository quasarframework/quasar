import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { hSlot } from '../../utils/private/render.js'

const separatorValues = [ 'horizontal', 'vertical', 'cell', 'none' ]

export default defineComponent({
  name: 'QMarkupTable',

  props: {
    ...useDarkProps,

    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    wrapCells: Boolean,

    separator: {
      type: String,
      default: 'horizontal',
      validator: v => separatorValues.includes(v)
    }
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const classes = computed(() =>
      'q-markup-table q-table__container q-table__card'
      + ` q-table--${ props.separator }-separator`
      + (isDark.value === true ? ' q-table--dark q-table__card--dark q-dark' : '')
      + (props.dense === true ? ' q-table--dense' : '')
      + (props.flat === true ? ' q-table--flat' : '')
      + (props.bordered === true ? ' q-table--bordered' : '')
      + (props.square === true ? ' q-table--square' : '')
      + (props.wrapCells === false ? ' q-table--no-wrap' : '')
    )

    return () => h('div', {
      class: classes.value
    }, [
      h('table', { class: 'q-table' }, hSlot(slots.default))
    ])
  }
})
