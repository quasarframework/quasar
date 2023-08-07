
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import request from './request.js'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

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
      const dir = join(rootFolder, 'dist/release-notes')
      const file = join(dir, `${ quasarVersion }.json`)

      fse.ensureDir(dir)
      fse.writeJsonSync(file, content)

      console.log(' Created:', file)
    })
  }
}

runRequests()
