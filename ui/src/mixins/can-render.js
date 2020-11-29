// this file will eventually be removed
// and superseeded by use-can-render.js
// after all components use composition api

// using it to manage SSR rendering with best performance
import { isRuntimeSsrPreHydration } from '../plugins/Platform.js'

export default {
  data () {
    return {
      canRender: !isRuntimeSsrPreHydration
    }
  },

  mounted () {
    if (this.canRender === false) {
      this.canRender = true
    }
  }
}
