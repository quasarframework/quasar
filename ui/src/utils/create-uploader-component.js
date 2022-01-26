import { coreProps, coreEmits, getRenderer } from '../components/uploader/uploader-core.js'

import { createComponent } from './private/create.js'
import getEmitsObject from './private/get-emits-object.js'

const coreEmitsObject = getEmitsObject(coreEmits)

export default ({ name, props, emits, injectPlugin }) => createComponent({
  name,

  props: {
    ...coreProps,
    ...props
  },

  emits: Object(emits) === emits
    ? { ...coreEmitsObject, ...emits }
    : [ ...coreEmits, ...emits ],

  setup () {
    return getRenderer(injectPlugin)
  }
})
