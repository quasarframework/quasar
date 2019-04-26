const fs = require('fs-extra')
let extend = undefined

/**
 * The .babelrc file has been created to assist Jest for transpiling.
 * You should keep your application's babel rules in this file.
 */

if (fs.existsSync('./.babelrc')) {
  extend = './.babelrc'
}

module.exports = {
  presets: [
    '@quasar/babel-preset-app'
  ],
  extends: extend
}
