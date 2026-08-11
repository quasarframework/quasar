import { config } from '@vue/test-utils'
import { afterEach } from 'vitest'

import { removeMountContainers } from './test-utils.js'

import 'quasar/src/css/index.sass'
import quasarVuePlugin from 'quasar/src/vue-plugin.js'

config.global.plugins.push(quasarVuePlugin)

afterEach(removeMountContainers)
