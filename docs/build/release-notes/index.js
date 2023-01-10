
const { writeJsonSync, ensureDir } = require('fs-extra')
const { join } = require('path')

const request = require('./request')

const versionRE = {
  quasar: /^2./,
  '@quasar/app-webpack': /^3./,
  '@quasar/app-vite': /^1./
}

const packagesDefinitions = {
  quasar: [],
  '@quasar/app-vite': [],
  '@quasar/app-webpack': [],
  '@quasar/cli': [],
  '@quasar/extras': [],
  '@quasar/icongenie': [],
  '@quasar/vite-plugin': []
}

request(packagesDefinitions, versionRE)
  .then(content => {
    const dir = join(__dirname, '../../dist/release-notes')
    const file = join(dir, 'v2.json')

    ensureDir(dir)
    writeJsonSync(file, content)

    console.log('Created:', file)
  })
