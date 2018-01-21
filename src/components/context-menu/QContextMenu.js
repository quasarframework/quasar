import ContextMenuDesktop from './ContextMenuDesktop'
import ContextMenuMobile from './ContextMenuMobile'
import Platform from '../../plugins/platform'

export default {
  name: 'q-context-menu',
  functional: true,
  render (h, ctx) {
    return h(
      Platform.is.mobile ? ContextMenuMobile : ContextMenuDesktop,
      ctx.data,
      ctx.children
    )
  }
}
