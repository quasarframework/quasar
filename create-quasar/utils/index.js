import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { sep, dirname, normalize, join, resolve, extname } from 'node:path'
import { spawn, execSync as exec } from 'node:child_process'

import { emptyDirSync, ensureDirSync, ensureFileSync, copySync } from 'fs-extra/esm'
import promptUser from 'prompts'
import compileTemplate from 'lodash/template.js'
import fglob from 'fast-glob'
import { yellow, green } from 'kolorist'

import logger from './logger.js'

const TEMPLATING_FILE_EXTENSIONS = [ '', '.json', '.js', '.cjs', '.ts', '.vue', '.md', '.html', '.sass' ]

async function prompts (scope, questions, opts) {
  const options = opts || {
    onCancel: () => {
      logger.fatal('Scaffolding cancelled')
    }
  }

  const answers = await promptUser(questions, options)
  Object.assign(scope, answers)
}

function createTargetDir (scope) {
  console.log()
  logger.log('Generating files...')
  console.log()

  const fn = scope.overwrite ? emptyDirSync : ensureDirSync
  fn(scope.projectFolder)
}

function convertArrayToObject (arr) {
  const acc = {}
  arr.forEach(key => {
    acc[ key ] = true
  })
  return acc
}

const runningPackageManager = (() => {
  const userAgent = process.env.npm_config_user_agent
  if (!userAgent) {
    return
  }

  const [ name, version ] = userAgent.split(' ')[ 0 ].split('/')
  return { name, version }
})()

function getCallerPath () {
  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack.slice(1)
  Error.prepareStackTrace = _prepareStackTrace
  const filename = stack[ 1 ].getFileName()
  return dirname(
    filename.startsWith('file://')
      ? fileURLToPath(filename)
      : filename
  )
}

function renderTemplate (relativePath, scope) {
  const templateDir = join(getCallerPath(), relativePath)
  const files = fglob.sync([ '**/*' ], { cwd: templateDir })

  for (const rawPath of files) {
    const targetRelativePath = rawPath.split('/').map(name => {
      // dotfiles are ignored when published to npm, therefore in templates
      // we need to prefix them with an underscore (e.g. "_.gitignore")
      // Also, some tools like ESLint expect valid config files, therefore
      // we also prefix files like "package.json" too. (e.g. "_package.json")
      return name.startsWith('_')
        ? name.slice(1)
        : name
    }).join('/')

    const targetPath = resolve(scope.projectFolder, targetRelativePath)
    const sourcePath = resolve(templateDir, rawPath)
    const extension = extname(targetRelativePath)

    ensureFileSync(targetPath)

    console.log(` ${ green('-') } ${ targetRelativePath }`)

    if (TEMPLATING_FILE_EXTENSIONS.includes(extension)) {
      const rawContent = readFileSync(sourcePath, 'utf-8')
      const template = compileTemplate(rawContent, { interpolate: /<%=([\s\S]+?)%>/g })

      let newContent = template(scope)
      if (extension === '.json') {
        try {
          // try to format the JSON
          newContent = JSON.stringify(JSON.parse(newContent), null, 2)
        } catch {
          // noop, the JSON might be containing comments, leave it unformatted
        }
      }

      writeFileSync(targetPath, newContent, 'utf-8')
    }
    else {
      copySync(sourcePath, targetPath)
    }
  }
}

function isValidPackageName (projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

function inferPackageName (projectFolder) {
  return projectFolder
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function escapeString (val) {
  return JSON.stringify(val).slice(1, -1)
}

function getGitUser () {
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

/**
 * Prints the final message with instructions of necessary next steps.
 *
 * @param {Object} scope Data from questionnaire.
 */
function printFinalMessage (scope) {
  const verPrefix = scope.quasarVersion ? scope.quasarVersion + '.' : ''
  const message = `
 To get started:
 ${ yellow(`
   cd ${ scope.projectFolderName }${ scope.skipDepsInstall !== true && scope.packageManager === false ? `
   yarn #or: npm install
   yarn lint --fix # or: npm run lint -- --fix` : '' }${ scope.skipDepsInstall !== true ? `
   quasar dev # or: yarn quasar dev # or: npx quasar dev` : '' }
 `) }
 Documentation can be found at: https://${ verPrefix }quasar.dev

 Quasar is relying on donations to evolve. We'd be very grateful if you can
 read our manifest on "Why donations are important": https://${ verPrefix }quasar.dev/why-donate
 Donation campaign: https://donate.quasar.dev
 Any amount is very welcome.
 If invoices are required, please first contact Razvan Stoenescu.

 Please give us a star on Github if you appreciate our work:
   https://github.com/quasarframework/quasar

 Enjoy! - Quasar Team
`

  console.log(message)
}

function runCommand (cmd, args, options) {
  console.log()
  return new Promise((resolve, reject) => {
    const runner = spawn(
      cmd,
      args,
      Object.assign({
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true
      }, options)
    )

    runner.on('exit', code => {
      console.log()

      if (code) {
        console.log(` ${ cmd } FAILED...`)
        console.log()
        reject()
      }
      else {
        resolve()
      }
    })
  })
}

function installDeps (scope) {
  const args = [ 'install' ]
  // Related to scripts/create-test-project.ts
  if (process.env.CREATE_TEST_PROJECT_OVERRIDE === 'true') {
    // If we don't use this flag, then the test project will become part of the monorepo and fail to install properly
    args.push('--ignore-workspace')
  }

  return runCommand(
    scope.packageManager,
    args,
    { cwd: scope.projectFolder }
  )
}

function lintFolder (scope) {
  return runCommand(
    scope.packageManager,
    scope.packageManager === 'npm'
      ? [ 'run', 'lint', '--', '--fix' ]
      : [ 'run', 'lint', '--fix' ],
    { cwd: scope.projectFolder }
  )
}

function hasGit () {
  try {
    exec('git --version')
    return true
  }
  catch (_) {}
}

function folderHasGit (cwd) {
  try {
    exec('git status', { stdio: 'ignore', cwd })
    return true
  }
  catch (_) {}
}

function initializeGit (projectFolder) {
  if (hasGit() !== true) {
    logger.log('Git is not installed on the system, so skipping Git repo initialization.')
    return
  }

  if (folderHasGit(projectFolder) === true) {
    logger.log('A parent of the project folder is already a Git repository, so skipping Git initialization.')
    return
  }

  try {
    exec('git init', { cwd: projectFolder })
    exec('git add -A', { cwd: projectFolder })
    exec('git commit -m "Initialize the project 🚀" --no-verify', { cwd: projectFolder })
  }
  catch (e) {
    logger.warn('Could not initialize Git repository. Please do this manually.')
    return
  }

  logger.log('Initialized Git repository 🚀')
}

const quasarConfigFilenameList = [
  'quasar.config.js',
  'quasar.config.mjs',
  'quasar.config.ts',
  'quasar.config.cjs',
  'quasar.conf.js' // legacy
]

function ensureOutsideProject () {
  let dir = process.cwd()

  while (dir.length && dir[ dir.length - 1 ] !== sep) {
    for (const name of quasarConfigFilenameList) {
      const filename = join(dir, name)
      if (existsSync(filename)) {
        logger.fatal('Error. This command must NOT be executed inside of a Quasar project folder.')
      }
    }

    dir = normalize(join(dir, '..'))
  }
}

const QUASAR_VERSIONS = [
  { title: 'Quasar v2 (Vue 3 | latest and greatest)', value: 'v2', description: 'recommended' },
  { title: 'Quasar v1 (Vue 2)', value: 'v1' }
]
const SCRIPT_TYPES = [
  { title: 'Javascript', value: 'js' },
  { title: 'Typescript', value: 'ts' }
]

const commonPrompts = {
  quasarVersion: {
    type: 'select',
    name: 'quasarVersion',
    message: 'Pick Quasar version:',
    initial: 0,
    choices: QUASAR_VERSIONS
  },

  scriptType: {
    type: 'select',
    name: 'scriptType',
    message: 'Pick script type:',
    initial: 0,
    choices: SCRIPT_TYPES
  },

  productName: {
    type: 'text',
    name: 'productName',
    message: 'Project product name: (must start with letter if building mobile apps)',
    initial: 'Quasar App',
    validate: val =>
      (val && val.length > 0) || 'Invalid product name'
  },

  description: {
    type: 'text',
    name: 'description',
    message: 'Project description:',
    initial: 'A Quasar Project',
    format: escapeString,
    validate: val =>
      val.length > 0 || 'Invalid project description'
  },

  author: {
    type: 'text',
    name: 'author',
    initial: () => getGitUser(),
    message: 'Author:'
  },

  license: {
    type: 'text',
    name: 'license',
    message: 'License type',
    initial: 'MIT'
  },

  repositoryType: {
    type: 'text',
    name: 'repositoryType',
    message: 'Repository type:',
    initial: 'git'
  },
  repositoryURL: {
    type: 'text',
    name: 'repositoryURL',
    message: 'Repository URL: (eg https://github.com/quasarframework/quasar)'
  },
  homepage: {
    type: 'text',
    name: 'homepage',
    message: 'Homepage URL:'
  },
  bugs: {
    type: 'text',
    name: 'bugs',
    message: 'Issue reporting URL: (eg https://github.com/quasarframework/quasar/issues)'
  }
}

export default {
  logger,

  prompts,
  createTargetDir,
  convertArrayToObject,
  runningPackageManager,
  renderTemplate,
  isValidPackageName,
  inferPackageName,

  printFinalMessage,
  installDeps,
  lintFolder,
  ensureOutsideProject,
  initializeGit,

  commonPrompts
}
