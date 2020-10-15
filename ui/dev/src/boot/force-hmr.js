/*
 * Forcing HMR to reload on changes to
 * Quasar UI source files. We just need
 * to reference the contents here.
 */

import * as components from 'quasar/src/components.js'
import * as directives from 'quasar/src/directives.js'
import * as plugins from 'quasar/src/plugins.js'
import * as utils from 'quasar/src/utils.js'

console.log('Quasar:', components, directives, plugins, utils)
