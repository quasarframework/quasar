import { defineComponent } from 'vue'

import { coreProps, coreEmits, getRenderer } from '../components/uploader/uploader-core.js'

export default ({ name, props, emits, injectPlugin }) => defineComponent({
  name,

  props: {
    ...coreProps,
    ...props
  },

  emits: [
    ...coreEmits,
    ...emits
  ],

  setup (props, { slots, emit }) {
    return getRenderer(props, slots, emit, injectPlugin)
  }
})
