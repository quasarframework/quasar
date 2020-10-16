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
