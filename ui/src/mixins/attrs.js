import { getPropCacheMixin } from '../utils/cache.js'

export const ariaHidden = { 'aria-hidden': 'true' }

export default getPropCacheMixin('$attrs', 'qAttrs')
