import './commands'

// Have to import the main quasar styles manually as the dev server is not loaded by @quasar/app
import '../../../src/css/index.sass'
// Same for the icons css
import '@quasar/extras/material-icons/material-icons.css'

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress'
import { config } from '@vue/test-utils'

// Overwrite the transition and transition-group stubs which are stubbed by test-utils by default.
// We do want transitions to show when doing visual testing :)
config.global.stubs = {}

installQuasarPlugin()
