// using it to manage SSR rendering with best performance
import { onSSR } from '../plugins/Platform.js'

export default {
  data () {
    return {
      canRender: !onSSR
    }
  },

  mounted () {
    if (this.canRender === false) {
      this.canRender = true
    }
  }
}
