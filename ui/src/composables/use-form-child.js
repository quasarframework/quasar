import { inject, watch, onBeforeUnmount, getCurrentInstance } from 'vue'

import { formKey } from '../utils/private/symbols.js'

export default function ({ validate, resetValidation, requiresQForm, disable }) {
  const $form = inject(formKey, false)

  if ($form !== false) {
    const vm = getCurrentInstance()

    // export public method (so it can be used in QForm)
    Object.assign(vm.proxy, validate)

    watch(disable, val => {
      if (val === true) {
        resetValidation()
        $form.unbindComponent(vm.proxy)
      }
      else {
        $form.bindComponent(vm.proxy)
      }
    })

    // register component to parent QForm
    disable.value !== true && $form.bindComponent(vm.proxy)

    onBeforeUnmount(() => {
      // unregister component
      disable.value !== true && $form.unbindComponent(vm.proxy)
    })
  }
  else if (requiresQForm !== true) {
    console.error('Parent QForm not found on useFormChild()!')
  }
}
