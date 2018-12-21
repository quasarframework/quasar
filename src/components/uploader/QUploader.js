import Vue from 'vue'

import UploaderBaseMixin from './uploader-base-mixin.js'
import UploaderXHRMixin from './uploader-xhr-mixin.js'

export default Vue.extend({
  name: 'QUploader',
  mixins: [ UploaderBaseMixin, UploaderXHRMixin ]
})
