// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import '@cypress/code-coverage/support'

// Have to import the main quasar styles manually as the dev server is not loaded by @quasar/app
import '../../../src/css/index.sass'
// Same for the icons css
import '@quasar/extras/material-icons/material-icons.css'

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress'

// Since Cypress v10 we cannot import `config` directly from VTU as Cypress bundles its own version of it
// See https://github.com/cypress-io/cypress/issues/22611
import { VueTestUtils } from 'cypress/vue'
const { config } = VueTestUtils

// Overwrite the transition and transition-group stubs which are stubbed by test-utils by default.
// We do want transitions to show when doing visual testing :)
config.global.stubs = {}

installQuasarPlugin()
