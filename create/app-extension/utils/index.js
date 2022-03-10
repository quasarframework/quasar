
const { readFileSync, writeFileSync } = require('fs')
const { join, resolve, extname } = require('path')
const { emptyDirSync, ensureDirSync, ensureFileSync, copySync } = require('fs-extra')
const prompts = require('prompts')
const compileTemplate = require('lodash.template')
const fglob = require('fast-glob')
const { yellow, green } = require('kolorist')
const exec = require('child_process').execSync

const logger = require('./logger')

const TEMPLATING_FILE_EXTENSIONS = [ '', '.json', '.js', '.ts', '.vue', '.md', '.html' ]

module.exports.join = join
module.exports.logger = logger

module.exports.prompts = function (questions, opts) {
  const options = opts || {
    onCancel: () => {
      logger.fatal('Scaffolding cancelled')
    }
  }

  return prompts(questions, options)
}

module.exports.getGitUser = function () {
  let name
  let email

  try {
    name = exec('git config --get user.name')
    email = exec('git config --get user.email')
  }
  catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')

  return (name || '') + (email || '')
}

module.exports.createTargetDir = function (dir, scope) {
  console.log()
  logger.log('Generating files...')
  console.log()

  const fn = scope.overwrite ? emptyDirSync : ensureDirSync
  fn(
    join(process.cwd(), dir)
  )
}

module.exports.convertArrayToObject = function (arr) {
  const acc = {}
  arr.forEach(key => {
    acc[key] = true
  })
  return acc
}

module.exports.renderTemplate = function (templateDir, dir, scope) {
  const files = fglob.sync(['**/*'], { cwd: templateDir })

  for (const rawPath of files) {
    const targetRelativePath = rawPath.split('/').map(name => {
      // dotfiles are ignored when published to npm, therefore in templates
      // we need to use underscore instead (e.g. "_gitignore")
      return name.charAt(0) === '_'
        ? `.${name.slice(1)}`
        : name
    }).join('/')

    const targetPath = resolve(dir, targetRelativePath)
    const sourcePath = resolve(templateDir, rawPath)

    ensureFileSync(targetPath)

    console.log(` ${green('-')} ${targetRelativePath}`)

    if (TEMPLATING_FILE_EXTENSIONS.includes(extname(targetRelativePath))) {
      const rawContent = readFileSync(sourcePath, 'utf-8')
      const template = compileTemplate(rawContent, { 'interpolate': /<%=([\s\S]+?)%>/g })

      writeFileSync(targetPath, template(scope), 'utf-8')
    }
    else {
      copySync(sourcePath, targetPath)
    }
  }
}

module.exports.isValidPackageName = function (projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

module.exports.inferPackageName = function (projectFolder) {
  return projectFolder
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

module.exports.escapeString = function (val) {
  return JSON.stringify(val).slice(1, -1)
}

function sortObject (object) {
  // Based on https://github.com/yarnpkg/yarn/blob/v1.3.2/src/config.js#L79-L85
  const sortedObject = {}
  Object.keys(object)
    .sort()
    .forEach(item => {
      sortedObject[item] = object[item]
    })
  return sortedObject
}

/**
 * Sorts dependencies in package.json alphabetically.
 * They are unsorted because they were grouped for the templating
 *
 * @param {string} dir Target directory for scaffolding
 */
module.exports.sortPackageJson = function (dir) {
  const pkgFile = join(dir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgFile))

  if (pkg.dependencies) {
    pkg.dependencies = sortObject(pkg.dependencies)
  }
  if (pkg.devDependencies) {
    pkg.devDependencies = sortObject(pkg.devDependencies)
  }

  writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')
}

/**
 * Prints the final message with instructions of necessary next steps.
 */
module.exports.printFinalMessage = function ({ dir }) {
  const message = `
To get started:

  ${yellow(`cd ${dir}`)}

Documentation can be found at: https://quasar.dev

Quasar is relying on donations to evolve. We'd be very grateful if you can
read our manifest on "Why donations are important": https://quasar.dev/why-donate
Donation campaign: https://donate.quasar.dev
Any amount is very welcomed.
If invoices are required, please first contact Razvan Stoenescu.

Please give us a star on Github if you appreciate our work:
  https://github.com/quasarframework/quasar

Enjoy! - Quasar Team
`

  console.log(message)
}
