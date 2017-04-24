import { current as theme } from '../../features/theme'
import InlineDatetimeIOS from './InlineDatetimeIOS.vue'
import InlineDatetimeMat from './InlineDatetimeMat.vue'

export default {
  name: 'q-inline-datetime',
  functional: true,
  render (h, ctx) {
    return h(
      theme === 'ios' ? InlineDatetimeIOS : InlineDatetimeMat,
      ctx.data,
      ctx.children
    )
  }
}
