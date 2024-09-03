import { config } from '@vue/test-utils'

import 'quasar/src/css/index.sass'
import quasarVuePlugin from 'quasar/src/vue-plugin.js'

config.global.plugins.push(quasarVuePlugin)
