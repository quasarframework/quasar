import { defineComponent } from 'vue'

import useUploader from '../../composables/use-uploader.js'
import useUploaderXhr from '../../composables/use-uploader-xhr.js'

export default defineComponent({
  name: 'QUploader',

  props: {
    ...useUploader.props,
    ...useUploaderXhr.props
  },

  emits: [
    ...useUploader.emits,
    ...useUploaderXhr.emits
  ],

  setup (props, { slots, emit }) {
    const uploaderState = useUploader.getState()
    const uploaderXhr = useUploaderXhr.getState(props, emit, uploaderState)
    const { renderUploader } = useUploader.getRender(props, slots, emit, { ...uploaderState, ...uploaderXhr })

    return renderUploader
  }
})
