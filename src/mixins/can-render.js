// using it to manage SSR rendering with best performance
import { isSSR } from '../plugins/platform'

export default {
  data () {
    return {
      canRender: !isSSR && !this.$q.platform.is.fromSSR
    }
  },
  mounted () {
    this.canRender = true
  }
}
