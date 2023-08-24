import { defineConfig } from 'cypress'

export default defineConfig({
  supportFolder: 'test/cypress/support',
  fixturesFolder: 'test/cypress/fixtures',
  videosFolder: 'test/cypress/videos',
  screenshotsFolder: 'test/cypress/screenshots',
  downloadsFolder: 'test/cypress/downloads',

  e2e: {
    supportFile: 'test/cypress/support/e2e.ts',
    specPattern: 'test/cypress/**/*.cy.ts',

    baseUrl: 'http://localhost:9000',

    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
