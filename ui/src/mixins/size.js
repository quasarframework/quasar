// this file will eventually be removed
// and superseeded by use-size.js
// after all components use composition api

import { useSizeDefaults, useSizeProps } from '../composables/use-size.js'

export const sizes = useSizeDefaults

export function getSizeMixin (sizes) {
  return {
    props: useSizeProps,

    computed: {
      sizeStyle () {
        if (this.size !== void 0) {
          return { fontSize: this.size in sizes ? `${sizes[ this.size ]}px` : this.size }
        }
      }
    }
  }
}

export default getSizeMixin(sizes)
