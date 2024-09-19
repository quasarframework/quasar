const { sources } = require('webpack')
const { existsSync, readFileSync } = require('fs-extra')

const appPaths = require('../../app-paths')

module.exports = class ElectronPackageJson {
  constructor (cfg = {}) {
    this.cfg = cfg

    const npmrc = appPaths.resolve.app('.npmrc')
    let content = existsSync(npmrc)
      ? readFileSync(npmrc, 'utf-8')
      : ''

    if (content.indexOf('shamefully-hoist') === -1) {
      content += '\n# needed by pnpm\nshamefully-hoist=true'
    }
    // very important, otherwise PNPM creates symlinks which is NOT
    // what we want for an Electron app that should run cross-platform
    if (content.indexOf('node-linker') === -1) {
      content += '\n# pnpm needs this otherwise it creates symlinks\nnode-linker=hoisted'
    }

    this.source = content
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('npmrc', compilation => {
      compilation.emitAsset('.npmrc', new sources.RawSource(this.source))
    })
  }
}
