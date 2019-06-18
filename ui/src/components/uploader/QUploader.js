import Vue from 'vue'

import QUploaderBase from './QUploaderBase.js'
import UploaderXHRMixin from './uploader-xhr-mixin.js'

export default Vue.extend({
  name: 'QUploader',
  mixins: [ QUploaderBase, UploaderXHRMixin ]
})
