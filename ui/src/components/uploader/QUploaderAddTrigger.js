import { inject } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import {
  emptyRenderFn,
  uploaderKey
} from '../../utils/private.symbols/symbols.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/uploader
 */
export default createComponent({
  name: 'QUploaderAddTrigger',

  setup() {
    const $trigger = inject(uploaderKey, emptyRenderFn)

    if ($trigger === emptyRenderFn) {
      console.error('QUploaderAddTrigger needs to be child of QUploader')
    }

    return $trigger
  }
})
