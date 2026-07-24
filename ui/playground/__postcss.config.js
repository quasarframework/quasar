/**
 * Change this file to postcss.config.js instead of __postcss.config.js
 * if you want to use RTL for the devserver.
 */

import rtlcss from 'postcss-rtlcss'
import { Mode } from 'postcss-rtlcss/options'

export default {
  plugins: [rtlcss({ mode: Mode.Override })]
}
