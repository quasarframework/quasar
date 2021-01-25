import { inject, onBeforeUnmount, getCurrentInstance } from 'vue'

import { formKey } from '../utils/private/symbols.js'

export default function ({ validate, requiresQForm }) {
  const $form = inject(formKey, false)

  if ($form !== false) {
    const vm = getCurrentInstance()

    // export public method (so it can be used in QForm)
    Object.assign(vm.proxy, validate)

    // register component to parent QForm
    $form.bindComponent(vm.proxy)

    onBeforeUnmount(() => {
      // unregister component
      $form.unbindComponent(vm.proxy)
    })
  }
  else if (requiresQForm !== true) {
    console.error('Parent QForm not found on useFormChild()!')
  }
}
