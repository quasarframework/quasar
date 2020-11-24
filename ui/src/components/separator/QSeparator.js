import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

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

  mixins: [DarkMixin],

  props: {
    spaced: [ Boolean, String ],
    inset: [ Boolean, String ],
    vertical: Boolean,
    color: String,
    size: String
  },

  computed: {
    orientation () {
      return this.vertical === true
        ? 'vertical'
        : 'horizontal'
    },

    classPrefix () {
      return ` q-separator--${this.orientation}`
    },

    insetClass () {
      return this.inset !== false
        ? `${this.classPrefix}-${insetMap[ this.inset ]}`
        : ''
    },

    classes () {
      return `q-separator q-separator${this.classPrefix}${this.insetClass}` +
        (this.color !== void 0 ? ` bg-${this.color}` : '') +
        (this.isDark === true ? ' q-separator--dark' : '')
    },

    style () {
      const style = {}

      if (this.size !== void 0) {
        style[ this.vertical === true ? 'width' : 'height' ] = this.size
      }

      if (this.spaced !== false) {
        const size = this.spaced === true
          ? `${margins.md}px`
          : this.spaced in margins ? `${margins[ this.spaced ]}px` : this.spaced

        const props = this.vertical === true
          ? [ 'Left', 'Right' ]
          : [ 'Top', 'Bottom' ]

        style[ `margin${props[ 0 ]}` ] = style[ `margin${props[ 1 ]}` ] = size
      }

      return style
    }
  },

  render () {
    return h('hr', {
      class: this.classes,
      style: this.style,
      role: 'separator',
      'aria-orientation': this.orientation
    })
  }
})
