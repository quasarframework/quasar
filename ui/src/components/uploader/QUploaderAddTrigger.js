import { inject } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { uploaderKey, emptyRenderFn } from '../../utils/private.symbols/symbols.js'

export default createComponent({
  name: 'QUploaderAddTrigger',

  setup () {
    const $trigger = inject(uploaderKey, emptyRenderFn)

    if ($trigger === emptyRenderFn) {
      console.error('QUploaderAddTrigger needs to be child of QUploader')
    }

    return $trigger
  }
})
