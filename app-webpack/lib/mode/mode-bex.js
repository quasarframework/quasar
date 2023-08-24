const fs = require('node:fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths.js')
const { log, warn } = require('../utils/logger.js')
const { hasTypescript } = require('../utils/has-typescript.js')

module.exports.QuasarMode = class QuasarMode {
  get isInstalled () {
    return fs.existsSync(appPaths.bexDir)
  }

  async add () {
    if (this.isInstalled) {
      warn('Browser Extension support detected already. Aborting.')
      return
    }

    console.log()

    const inquirer = require('inquirer')
    const answer = await inquirer.prompt([ {
      name: 'manifestVersion',
      type: 'list',
      choices: [
        { name: 'Manifest v2 (works with both Chrome and FF)', value: 'manifest-v2' },
        { name: 'Manifest v3 (works with Chrome only currently)', value: 'manifest-v3' }
      ],
      message: 'What version of manifest would you like?'
    } ])

    log('Creating Browser Extension source folder...')

    fse.copySync(appPaths.resolve.cli('templates/bex/common'), appPaths.bexDir)
    fse.copySync(appPaths.resolve.cli('templates/bex/bex-flag.d.ts'), appPaths.resolve.bex('bex-flag.d.ts'))

    const format = hasTypescript ? 'ts' : 'default'
    fse.copySync(appPaths.resolve.cli(`templates/bex/${ format }/${ answer.manifestVersion }`), appPaths.bexDir)

    log('Browser Extension support was added')
  }

  remove () {
    if (!this.isInstalled) {
      warn('No Browser Extension support detected. Aborting.')
      return
    }

    log('Removing Browser Extension source folder')
    fse.removeSync(appPaths.bexDir)
    log('Browser Extension support was removed')
  }
}
