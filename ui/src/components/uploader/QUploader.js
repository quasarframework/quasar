import Vue from 'vue'

import WUploaderBase from './QUploaderBase.js'
import UploaderXHRMixin from './uploader-xhr-mixin.js'

export default Vue.extend({
  name: 'WUploader',
  mixins: [ WUploaderBase, UploaderXHRMixin ]
})
