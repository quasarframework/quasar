import {
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue'

import { formKey } from '../../utils/private.symbols/symbols.js'

export default function useFormChild({
  validate,
  resetValidation,
  requiresQForm
}) {
  const $form = inject(formKey, false)

  if ($form !== false) {
    const { props, proxy } = getCurrentInstance()

    // export public method (so it can be used in QForm)
    Object.assign(proxy, { validate, resetValidation })

    watch(
      () => props.disable,
      val => {
        if (val) {
          if (typeof resetValidation === 'function') resetValidation()
          $form.unbindComponent(proxy)
        } else {
          $form.bindComponent(proxy)
        }
      }
    )

    onMounted(() => {
      // register to parent QForm
      if (!props.disable) $form.bindComponent(proxy)
    })

    onBeforeUnmount(() => {
      // un-register from parent QForm
      if (!props.disable) $form.unbindComponent(proxy)
    })
  } else if (requiresQForm) {
    console.error('Parent QForm not found on useFormChild()!')
  }
}
