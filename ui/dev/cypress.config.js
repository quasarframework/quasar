const registerCodeCoverageTasks = require('@cypress/code-coverage/task')
const { injectQuasarDevServerConfig } = require('@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server')
const { defineConfig } = require('cypress')

const moduleAlias = require('module-alias')
const { join } = require('path')

moduleAlias.addAlias('quasar', join(__dirname, '../../..'))

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

      return config
    },
    baseUrl: 'http://localhost:9000/',
    supportFile: '../test/cypress/support/e2e.js',
    specPattern: '../test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  },
  component: {
    setupNodeEvents (on, config) {
      registerCodeCoverageTasks(on, config)

      // Edit the project root as the test files are inside /ui/src and the server is running on /ui/dev
      // This affects `specPattern` option
      config.projectRoot = join(__dirname, '../../..')

      return config
    },
    supportFile: '../test/cypress/support/component.js',
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: '../test/cypress/support/component-index.html',
    devServer: injectQuasarDevServerConfig()
  }
})
