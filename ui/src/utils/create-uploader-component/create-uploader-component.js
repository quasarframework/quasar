import {
  coreEmits,
  coreProps,
  getRenderer
} from '../../components/uploader/uploader-core.js'

import { createComponent } from '../private.create/create.js'
import getEmitsObject from '../private.get-emits-object/get-emits-object.js'
import { isObject } from '../is/is.js'

const coreEmitsObject = /*#__PURE__*/ getEmitsObject(coreEmits)

export default function createUploaderComponent({
  name,
  props,
  emits,
  injectPlugin
}) {
  return createComponent({
    name,

    props: {
      ...coreProps,
      ...props
    },

    emits: isObject(emits)
      ? { ...coreEmitsObject, ...emits }
      : [...coreEmits, ...emits],

    setup(_, { expose }) {
      return getRenderer(injectPlugin, expose)
    }
  })
}
