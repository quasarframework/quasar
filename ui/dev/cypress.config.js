const registerCodeCoverageTasks = require('@cypress/code-coverage/task')
const { injectQuasarDevServerConfig } = require('@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server')
const { defineConfig } = require('cypress')

const moduleAlias = require('module-alias')
const { join } = require('path')

const uiFolder = join(__dirname, '..')

// Quasar dependency should point to the current UI project, which we build right before running tests
moduleAlias.addAlias('quasar', uiFolder)

module.exports = defineConfig({
  projectId: '5zr217',
  fixturesFolder: '../test/cypress/fixtures',
  screenshotsFolder: '../test/cypress/screenshots',
  videosFolder: '../test/cypress/videos',
  videoCompression: false,
  videoUploadOnPasses: false,
  video: false,
  e2e: {
    setupNodeEvents (on, config) {
      registerCodeCoverageTasks(on, config)
    },
    baseUrl: 'http://localhost:9000/',
    supportFile: '../test/cypress/support/e2e.js',
    specPattern: '../test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  },
  component: {
    setupNodeEvents (on, config) {
      registerCodeCoverageTasks(on, config)
    },
    supportFile: '../test/cypress/support/component.js',
    specPattern: '../src/components/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: '../test/cypress/support/component-index.html',
    devServer: injectQuasarDevServerConfig()
  }
})
