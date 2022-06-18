import { inject, watch, onBeforeUnmount, getCurrentInstance } from 'vue'

import { formKey } from '../utils/private/symbols.js'

export default function ({ validate, resetValidation, requiresQForm }) {
  const $form = inject(formKey, false)

  if ($form !== false) {
    const { props, proxy } = getCurrentInstance()

    // export public method (so it can be used in QForm)
    Object.assign(proxy, { validate, resetValidation })

    watch(() => props.disable, val => {
      if (val === true) {
        typeof resetValidation === 'function' && resetValidation()
        $form.unbindComponent(proxy)
      }
      else {
        $form.bindComponent(proxy)
      }
    })

    // register component to parent QForm
    props.disable !== true && $form.bindComponent(proxy)

    onBeforeUnmount(() => {
      // unregister component
      props.disable !== true && $form.unbindComponent(proxy)
    })
  }
  else if (requiresQForm === true) {
    console.error('Parent QForm not found on useFormChild()!')
  }
}
