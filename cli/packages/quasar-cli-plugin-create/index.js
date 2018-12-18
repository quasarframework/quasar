#!/usr/bin/env node

const exists = require('fs').existsSync
const path = require('path')
const home = require('user-home')
const tildify = require('tildify')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const rm = require('rimraf')
const download = require('')

const QuasarCLI = require('@quasar/cli')
const { generate, logger, localPath, banner } = require('@quasar/cli-helpers')
const { isLocalPath, getTemplatePath } = localPath

class QuasarCLIPluginCreate extends QuasarCLI {
  constructor ({ init = true, sliceAt = 2, auto = true }) {
    super({
      init,
      auto,
      sliceAt,
      min: {
        alias: {
          b: 'branch',
          k: 'kit',
          c: 'clone',
          o: 'offline',
          h: 'help'
        },
        boolean: [ 'c', 'o', 'h' ],
        string: [ 'k', 'b' ]
      }
    })

    console.log()
    console.log(
      banner
    )

    this.template = this.argv.kit
      ? (
        this.argv.kit.indexOf('/') > -1
          ? this.argv.kit
          : 'quasarframework/quasar-starter-kit-' + this.argv.kit
      )
      : 'quasarframework/quasar-starter-kit'
    this.rawName = this.argv._[ 0 ]
    this.inPlace = !this.rawName || this.rawName === '.'
    this.name = this.inPlace ? path.relative('../', process.cwd()) : this.rawName
    this.to = path.resolve(this.rawName || '.')
    this.tmp = path.join(home, '.quasar-starter-kits', this.template.replace(/[\/:]/g, '-'))
  }

  start () {
    console.log(this.argv)
    if (this.argv.help) {
      this.help()
    }

    // Following is adapted from Vue CLI v2 "init" command

    if (this.argv.branch) {
      this.template += '#' + this.argv.branch
    }

    if (this.argv.offline) {
      console.log(`> Use cached template at ${chalk.yellow(tildify(this.tmp))}`)
      this.template = this.tmp
    }

    // console.log()
    // process.on('exit', () => {
    //   console.log()
    // })
    if (this.auto && (this.inPlace || exists(this.to))) {
      inquirer.prompt([ {
        type: 'confirm',
        message: this.inPlace
          ? 'Generate project in current directory?'
          : 'Target directory exists. Continue?',
        name: 'ok'
      } ]).then(answers => {
        if (answers.ok && this.auto) {
          this.run()
        }
      }).catch(logger.fatal)
    }
    else {
      if (this.auto) {
        this.run()
      }
    }
  }

  run () {
    throw new Error('DONT START')
    // check if template isn't local
    if (isLocalPath(this.template) !== true) {
      this.downloadAndGenerate()
    }

    const templatePath = getTemplatePath(this.template)
    if (exists(templatePath)) {
      generate(this.name, templatePath, this.to, err => {
        if (err) logger.fatal(err)
        console.log()
        logger.success('Generated "%s".', this.name)
      })
    }
    else {
      logger.fatal('Local template "%s" not found.', this.template)
    }
  }

  downloadAndGenerate () {
    const spinner = ora('downloading template')
    spinner.start()

    // Remove if local template exists
    if (exists(this.tmp)) {
      rm(this.tmp)
    }

    download(this.template, this.tmp, { clone: this.argv.clone }, err => {
      spinner.stop()

      if (err) {
        logger.fatal('Failed to download repo ' + this.template + ': ' + err.message.trim())
      }

      generate(this.name, this.tmp, this.to, err => {
        if (err) {
          logger.fatal(err)
        }

        console.log()
        logger.success('Generated "%s".', name)
      })
    })
  }

  help () {
    console.log(`
  Description
    Creates a Quasar project folder

  Usage
    $ quasar create <project-name> [--kit <kit-name>] [--branch <version-name>]

    $ quasar create my-project
         # installs latest Quasar
    $ quasar create my-project --branch v0.17
         # installs specific version (only major+minor version)
    $ quasar create my-project --kit umd
         # installs umd demo
    $ quasar create my-project --kit user/github-starter-kit
         # uses custom starter kit
    $ quasar create my-project --kit ./starter-kit-folder
         # use custom starter kit located at ./starter-kit-folder

  Options
    --kit, -k      Use specific starter kit
    --branch, -b   Use specific branch of the starter kit
    --clone, -c    Use git clone
    --offline, -o  Use cached starter kit
    --help, -h     Displays this message
  `)
    this.stop()
  }
}

const isCLI = !module.parent
const isTesting = process.env.Q_APP_ENV === 'testing' || process.env.NODE_ENV === 'testing'

// Export Class if it was required for extending
// This could include an extra flag for testing
module.exports = isCLI || isTesting
  ? new QuasarCLIPluginCreate()
  : QuasarCLIPluginCreate
