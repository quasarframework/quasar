#!/usr/bin/env node

const
  exists = require('fs').existsSync,
  path = require('path'),
  home = require('user-home'),
  tildify = require('tildify'),
  inquirer = require('inquirer')

// const { generate, logger } = require('@quasar/cli-helpers')
const { generate, logger, localPath, banner } = require('@quasar/cli-helpers')
const { isLocalPath, getTemplatePath } = localPath

// const QuasarCLI = require('@quasar/cli')
const QuasarCLI = require('@quasar/cli')
class QuasarCLIPluginCreate extends QuasarCLI {
  constructor(){
    super({sliceAt:2, min: {
      alias: {
        b: 'branch',
        k: 'kit',
        c: 'clone',
        o: 'offline',
        h: 'help'
      },
      boolean: ['c', 'o', 'h'],
      string: ['k', 'b']
    }})
    const argv = this.argv

    if (argv.help) {
      this.help()
    }

    console.log()
    console.log(
      banner
    )

// Following is adapted from Vue CLI v2 "init" command

    let this.template = template = argv.kit
      ? (
        argv.kit.indexOf('/') > -1
          ? argv.kit
          : 'quasarframework/quasar-starter-kit-' + argv.kit
      )
      : 'quasarframework/quasar-starter-kit'

    if (argv.branch) {
      template += '#' + argv.branch
    }

    const
      rawName = argv._[0],
      inPlace = !rawName || rawName === '.',
      this.name = name = inPlace ? path.relative('../', process.cwd()) : rawName,
      this.to = to = path.resolve(rawName || '.')

    const this.tmp = tmp = path.join(home, '.quasar-starter-kits', template.replace(/[\/:]/g, '-'))
    if (argv.offline) {
      console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
      template = tmp
    }

    console.log()
    process.on('exit', () => {
      console.log()
    })

    if (inPlace || exists(to)) {
      inquirer.prompt([{
        type: 'confirm',
        message: inPlace
          ? 'Generate project in current directory?'
          : 'Target directory exists. Continue?',
        name: 'ok'
      }]).then(answers => {
        if (answers.ok) {
          this.start()
        }
      }).catch(logger.fatal)
    }
    else {
      this.start()
    }
  }

  start () {
    // check if template isn't local
    if (isLocalPath(this.template) !== true) {
      this.downloadAndGenerate()
      return
    }

    const templatePath = getTemplatePath(this.template)
    if (exists(templatePath)) {
      generate(name, templatePath, to, err => {
        if (err) logger.fatal(err)
        console.log()
        logger.success('Generated "%s".', name)
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
  help(){
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
  }
}

var isCLI = !module.parent;
var isTesting = process.env.Q_APP_ENV === 'testing' || process.env.NODE_ENV === 'testing'

// Export Class if it was required for extending
// This could include an extra flag for testing
module.exports = isCLI || isTesting
  ? new QuasarCLIPluginCreate({auto:true})
  : QuasarCLIPluginCreate
