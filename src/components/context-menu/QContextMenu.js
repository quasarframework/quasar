import ContextMenuDesktop from './ContextMenuDesktop'
import ContextMenuMobile from './ContextMenuMobile'

export default {
  name: 'q-context-menu',
  functional: true,
  render (h, ctx) {
    return h(
      this.$q.platform.is.mobile ? ContextMenuMobile : ContextMenuDesktop,
      ctx.data,
      ctx.children
    )
  }
}
