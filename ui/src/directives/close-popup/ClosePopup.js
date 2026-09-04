import { createDirective } from '../../utils/private.create/create.js'
import {
  closePortals,
  getPortalProxy
} from '../../utils/private.portal/portal.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

/*
 * depth
 *   < 0  --> close all chain
 *   0    --> disabled
 *   > 0  --> close chain up to N parent
 */

function getDepth(value) {
  if (value === false) return 0
  if (value === true || value === void 0) return 1

  return Number.parseInt(value, 10) || 0
}

function onClick(evt) {
  const el = evt.currentTarget
  const depth = el.__qclosepopup

  // allow @click to be emitted
  if (depth !== 0) {
    setTimeout(() => {
      const proxy = getPortalProxy(el)
      if (proxy !== void 0) {
        closePortals(proxy, evt, depth)
      }
    }, 0)
  }
}

function onKeyup(evt) {
  if (isKeyCode(evt, 13)) onClick(evt)
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'close-popup', getSSRProps }
    : {
        name: 'close-popup',

        beforeMount(el, { value }) {
          el.__qclosepopup = getDepth(value)
          el.addEventListener('click', onClick)
          el.addEventListener('keyup', onKeyup)
        },

        updated(el, { value, oldValue }) {
          if (value !== oldValue) {
            el.__qclosepopup = getDepth(value)
          }
        },

        beforeUnmount(el) {
          el.removeEventListener('click', onClick)
          el.removeEventListener('keyup', onKeyup)
          el.__qclosepopup = void 0
        }
      }
)
