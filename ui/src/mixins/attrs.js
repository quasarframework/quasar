import { getPropCacheMixin } from '../utils/cache.js'

export const ariaHidden = { 'aria-hidden': 'true' }

export const iconAsButton = { tabindex: 0, type: 'button', 'aria-hidden': false, role: null }

export default getPropCacheMixin('$attrs', 'qAttrs')
