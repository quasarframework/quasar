import { defineComponent, inject } from 'vue'

import { uploaderKey } from '../../utils/private/symbols.js'

export default defineComponent({
  name: 'QUploaderAddTrigger',

  setup () {
    return inject(uploaderKey, () => {
      console.error('QUploaderAddTrigger needs to be child of QUploader')
    })
  }
})
