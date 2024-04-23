import { h, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'

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

export default createComponent({
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
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const orientation = computed(() => (
      props.vertical === true
        ? 'vertical'
        : 'horizontal'
    ))

    const orientClass = computed(() => ` q-separator--${ orientation.value }`)

    const insetClass = computed(() => (
      props.inset !== false
        ? `${ orientClass.value }-${ insetMap[ props.inset ] }`
        : ''
    ))

    const classes = computed(() =>
      `q-separator${ orientClass.value }${ insetClass.value }`
      + (props.color !== void 0 ? ` bg-${ props.color }` : '')
      + (isDark.value === true ? ' q-separator--dark' : '')
    )

    const style = computed(() => {
      const acc = {}

      if (props.size !== void 0) {
        acc[ props.vertical === true ? 'width' : 'height' ] = props.size
      }

      if (props.spaced !== false) {
        const size = props.spaced === true
          ? `${ margins.md }px`
          : props.spaced in margins ? `${ margins[ props.spaced ] }px` : props.spaced

        const dir = props.vertical === true
          ? [ 'Left', 'Right' ]
          : [ 'Top', 'Bottom' ]

        acc[ `margin${ dir[ 0 ] }` ] = acc[ `margin${ dir[ 1 ] }` ] = size
      }

      return acc
    })

    return () => h('hr', {
      class: classes.value,
      style: style.value,
      'aria-orientation': orientation.value
    })
  }
})
