import { coreProps, coreEmits, getRenderer } from '../components/uploader/uploader-core.js'

import { createComponent } from './private/create.js'

export default ({ name, props, emits, injectPlugin }) => createComponent({
  name,

  props: {
    ...coreProps,
    ...props
  },

  emits: [
    ...coreEmits,
    ...emits
  ],

  setup () {
    return getRenderer(injectPlugin)
  }
})
