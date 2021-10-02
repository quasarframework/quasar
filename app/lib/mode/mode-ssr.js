const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const { log, warn } = require('../helpers/logger')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.ssrDir)
  }

  async add () {
    if (this.isInstalled) {
      warn(`SSR support detected already. Aborting.`)
      return
    }

    // experimental fastify server
    const express = 'express (recommended)'
    const fastify = 'fastify (experimental)'
    const inquirer = require('inquirer')
    const { action } = await inquirer.prompt([{
      name: 'action',
      type: 'list',
      message: `Please choose http framework:`,
      choices: [express, fastify],
      default: 'overwrite'
    }])

    log(`Creating SSR source folder...`)
    fse.copySync(appPaths.resolve.cli(action === express ? 'templates/ssr' : 'templates/ssr-fastify'), appPaths.ssrDir)
    log(`SSR support was added`)
    if (action === fastify) log(`Please update quasar.conf.js with flag "ssr -> fastify = true"`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No SSR support detected. Aborting.`)
      return
    }

    log(`Removing SSR source folder`)
    fse.removeSync(appPaths.ssrDir)
    log(`SSR support was removed`)
  }
}

module.exports = Mode
