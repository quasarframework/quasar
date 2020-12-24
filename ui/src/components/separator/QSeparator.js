import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

const insetMap = {
  true: 'inset',
  item: 'item-inset',
  'item-thumbnail': 'item-thumbnail-inset'
}

export const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
}

export default defineComponent({
  name: 'QSeparator',

  props: {
    ...useDarkProps,

    spaced: [ Boolean, String ],
    inset: [ Boolean, String ],
    vertical: Boolean,
    color: String,
    size: String
  },

  setup (props) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const orientation = computed(() =>
      props.vertical === true
        ? 'vertical'
        : 'horizontal'
    )

    const classPrefix = computed(() => ` q-separator--${orientation.value}`)

    const insetClass = computed(() =>
      props.inset !== false
        ? `${classPrefix.value}-${insetMap[ props.inset ]}`
        : ''
    )

    const classes = computed(() =>
      `q-separator q-separator${classPrefix.value}${insetClass.value}` +
      (props.color !== void 0 ? ` bg-${props.color}` : '') +
      (isDark.value === true ? ' q-separator--dark' : '')
    )

    const style = computed(() => {
      const acc = {}

      if (props.size !== void 0) {
        acc[ props.vertical === true ? 'width' : 'height' ] = props.size
      }

      if (props.spaced !== false) {
        const size = props.spaced === true
          ? `${margins.md}px`
          : props.spaced in margins ? `${margins[ props.spaced ]}px` : props.spaced

        const dir = props.vertical === true
          ? [ 'Left', 'Right' ]
          : [ 'Top', 'Bottom' ]

        acc[ `margin${dir[ 0 ]}` ] = acc[ `margin${dir[ 1 ]}` ] = size
      }

      return acc
    })

    return () => h('hr', {
      class: classes.value,
      style: style.value,
      role: 'separator',
      'aria-orientation': orientation.value
    })
  }
})
