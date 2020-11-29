// this file will eventually be removed
// and superseeded by use-dark.js
// after all components use composition api

import { useDarkProps } from '../composables/use-dark.js'

export default {
  props: useDarkProps,

  computed: {
    isDark () {
      return this.dark === null
        ? this.$q.dark.isActive
        : this.dark
    }
  }
}
