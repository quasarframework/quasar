import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'
import {
  createClosePopupContext,
  getClosePopupDepth
} from './use-close-popup.js'

/**
 * @api directive
 * @docsUrl https://v2.quasar.dev/vue-directives/close-popup
 */
export default createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'close-popup', getSSRProps }
    : {
        name: 'close-popup',

        beforeMount(el, { value }) {
          const ctx = createClosePopupContext(el, value)

          el.__qclosepopup = ctx

          el.addEventListener('click', ctx.handler)
          el.addEventListener('keyup', ctx.handlerKey)
        },

        updated(el, { value, oldValue }) {
          if (value !== oldValue) {
            el.__qclosepopup.depth = getClosePopupDepth(value)
          }
        },

        beforeUnmount(el) {
          const ctx = el.__qclosepopup
          el.removeEventListener('click', ctx.handler)
          el.removeEventListener('keyup', ctx.handlerKey)
          delete el.__qclosepopup
        }
      }
)
