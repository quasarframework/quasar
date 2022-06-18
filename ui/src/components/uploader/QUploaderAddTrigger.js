import { inject } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { uploaderKey } from '../../utils/private/symbols.js'

export default createComponent({
  name: 'QUploaderAddTrigger',

  setup () {
    return inject(uploaderKey, () => {
      console.error('QUploaderAddTrigger needs to be child of QUploader')
    })
  }
})
