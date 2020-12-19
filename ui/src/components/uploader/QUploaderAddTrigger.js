import { defineComponent, inject } from 'vue'

import { uploaderKey } from '../../utils/symbols.js'

export default defineComponent({
  name: 'QUploaderAddTrigger',

  setup () {
    const renderInput = inject(uploaderKey, () => {
      console.error('QUploaderAddTrigger needs to be child of QUploader')
    })

    return renderInput
  }
})
