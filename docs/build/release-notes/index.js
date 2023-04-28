
const { writeJsonSync, ensureDir } = require('fs-extra')
const { join } = require('path')

const request = require('./request')

const api = {
  v2: {
    versionRE: {
      quasar: /^2./,
      '@quasar/app-webpack': /^3./,
      '@quasar/app-vite': /^1./
    },
    packages: {
      quasar: [],
      '@quasar/app-vite': [],
      '@quasar/app-webpack': [],
      '@quasar/cli': [],
      '@quasar/extras': [],
      '@quasar/icongenie': [],
      '@quasar/vite-plugin': []
    }
  }
}

async function runRequests () {
  for (const quasarVersion in api) {
    const { versionRE, packages } = api[ quasarVersion ]

    console.log(`Requesting release notes for Quasar v${ quasarVersion }...`)

    await request(packages, versionRE).then(content => {
      const dir = join(__dirname, '../../dist/release-notes')
      const file = join(dir, `${ quasarVersion }.json`)

      ensureDir(dir)
      writeJsonSync(file, content)

      console.log(' Created:', file)
    })
  }
}

runRequests()
