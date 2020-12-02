// this file will eventually be removed
// and superseeded by use-align.js
// after all components use composition api

import { alignMap, useAlignProps } from '../composables/use-align.js'

export default {
  props: useAlignProps,

  computed: {
    alignClass () {
      const align = this.align === void 0
        ? this.$props.vertical === true ? 'stretch' : 'left'
        : this.align

      return `${this.$props.vertical === true ? 'items' : 'justify'}-${alignMap[ align ]}`
    }
  }
}
