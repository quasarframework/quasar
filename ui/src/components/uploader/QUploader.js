import { defineComponent } from 'vue'

import QUploaderBase from './QUploaderBase.js'
import UploaderXHRMixin from './uploader-xhr-mixin.js'

export default defineComponent({
  name: 'QUploader',
  mixins: [ QUploaderBase, UploaderXHRMixin ]
})
