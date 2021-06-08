import { closePortals, getPortalVm } from '../utils/private/portal.js'
import { isKeyCode } from '../utils/private/key-composition.js'
import getSSRProps from '../utils/private/noop-ssr-directive-transform.js'

/*
 * depth
 *   < 0  --> close all chain
 *   0    --> disabled
 *   > 0  --> close chain up to N parent
 */

function getDepth (value) {
  if (value === false) {
    return 0
  }
  if (value === true || value === void 0) {
    return 1
  }

  const depth = parseInt(value, 10)
  return isNaN(depth) ? 0 : depth
}

export default __QUASAR_SSR_SERVER__
  ? { name: 'close-popup', getSSRProps }
  : {
      name: 'close-popup',

      beforeMount (el, { value }) {
        const ctx = {
          depth: getDepth(value),

          handler (evt) {
            // allow @click to be emitted
            ctx.depth !== 0 && setTimeout(() => {
              const vm = getPortalVm(el)
              if (vm !== void 0) {
                closePortals(vm, evt, ctx.depth)
              }
            })
          },

          handlerKey (evt) {
            isKeyCode(evt, 13) === true && ctx.handler(evt)
          }
        }

        el.__qclosepopup = ctx

        el.addEventListener('click', ctx.handler)
        el.addEventListener('keyup', ctx.handlerKey)
      },

      updated (el, { value, oldValue }) {
        if (value !== oldValue) {
          el.__qclosepopup.depth = getDepth(value)
        }
      },

      beforeUnmount (el) {
        const ctx = el.__qclosepopup
        el.removeEventListener('click', ctx.handler)
        el.removeEventListener('keyup', ctx.handlerKey)
        delete el.__qclosepopup
      }
    }
