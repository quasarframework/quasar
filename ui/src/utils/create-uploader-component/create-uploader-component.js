import { coreProps, coreEmits, getRenderer } from '../../components/uploader/uploader-core.js'

import { createComponent } from '../private.create/create.js'
import getEmitsObject from '../private.get-emits-object/get-emits-object.js'
import { isObject } from '../is/is.js'

const coreEmitsObject = getEmitsObject(coreEmits)

export default ({ name, props, emits, injectPlugin }) => createComponent({
  name,

  props: {
    ...coreProps,
    ...props
  },

  emits: isObject(emits) === true
    ? { ...coreEmitsObject, ...emits }
    : [ ...coreEmits, ...emits ],

  setup (_, { expose }) {
    return getRenderer(injectPlugin, expose)
  }
})
