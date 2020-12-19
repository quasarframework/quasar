import { defineComponent } from 'vue'

import { useUploaderState, useUploader, useUploaderProps, useUploaderEmits } from './use-uploader.js'
import { useUploaderXhr, useUploaderXhrProps, useUploaderXhrEmits } from './use-uploader-xhr.js'

export default defineComponent({
  name: 'QUploader',

  props: {
    ...useUploaderProps,
    ...useUploaderXhrProps
  },

  emits: [
    ...useUploaderEmits,
    ...useUploaderXhrEmits
  ],

  setup (props, { slots, emit }) {
    const uploaderState = useUploaderState(props)
    const uploaderXhr = useUploaderXhr(props, emit, uploaderState)
    const { renderUploader } = useUploader(props, slots, emit, { ...uploaderState, ...uploaderXhr })

    return renderUploader
  }
})
