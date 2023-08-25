const { resolve } = require('node:path')

module.exports = {
  parserOptions: {
    project: resolve(__dirname, './jsconfig.json'),
  },

  overrides: [
    {
      files: ['custom-service-worker.js'],

      env: {
        serviceworker: true
      }
    }
  ]
}
