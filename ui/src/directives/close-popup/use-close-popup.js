import {
  closePortals,
  getPortalProxy
} from '../../utils/private.portal/portal.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

/*
 * depth
 *   < 0  --> close all chain
 *   0    --> disabled
 *   > 0  --> close chain up to N parent
 */

/**
 * Normalizes the public v-close-popup value into the internal popup depth.
 *
 * @api value
 * @type {Boolean|Number|String}
 * @desc If value is 0 or 'false' then directive is disabled; if value is < 0 then it closes all popups in the chain; if value is 1 or 'true' or undefined then it closes only the parent popup; if value is > 1 it closes the specified number of parent popups in the chain (note that chained QMenus are considered 1 popup only & QPopupProxy separates chained menus)
 * @example # v-close-popup
 * @example # v-close-popup="booleanState"
 * @example # v-close-popup="-1"
 * @example # v-close-popup="2"
 * @example # v-close-popup="0"
 */
export function getClosePopupDepth(value) {
  if (value === false) return 0
  if (value === true || value === void 0) return 1

  return Number.parseInt(value, 10) || 0
}

export function createClosePopupContext(el, value) {
  const ctx = {
    depth: getClosePopupDepth(value),

    handler(evt) {
      // allow @click to be emitted
      if (ctx.depth !== 0) {
        setTimeout(() => {
          const proxy = getPortalProxy(el)
          if (proxy !== void 0) {
            closePortals(proxy, evt, ctx.depth)
          }
        })
      }
    },

    handlerKey(evt) {
      if (isKeyCode(evt, 13)) ctx.handler(evt)
    }
  }

  return ctx
}
