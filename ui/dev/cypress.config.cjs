const registerCodeCoverageTasks = require('@cypress/code-coverage/task')
const { defineConfig } = require('cypress')

const viteVuePlugin = require('@vitejs/plugin-vue')
const { quasar, transformAssetUrls } = require('@quasar/vite-plugin')

const { join } = require('path')

module.exports = defineConfig({
  projectId: '5zr217',
  fixturesFolder: '../test/cypress/fixtures',
  screenshotsFolder: '../test/cypress/screenshots',
  videosFolder: '../test/cypress/videos',
  videoCompression: false,
  video: false,
  ...(process.env.CYPRESS_JUNIT_RESULTS_FILENAME !== undefined ? {
    reporter: 'junit',
    reporterOptions: {
      mochaFile: process.env.CYPRESS_JUNIT_RESULTS_FILENAME
    }
  } : {}),
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
    specPattern: [ '../src/components/**/*.cy.{js,jsx,ts,tsx}', '../src/composables/**/*.cy.{js,jsx,ts,tsx}' ],
    indexHtmlFile: '../test/cypress/support/component-index.html',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        resolve: {
          alias: {
            quasar: join(__dirname, '../')
          }
        },
        plugins: [
          viteVuePlugin({ template: { transformAssetUrls } }),
          quasar({
            devTreeshaking: true
          })
        ]
      }
    }
  }
})
