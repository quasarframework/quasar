import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join, resolve } from 'node:path'
import { execSync as exec } from 'node:child_process'
import { sync as spawnSync } from 'cross-spawn'
import {
  copySync,
  emptyDirSync,
  ensureDirSync,
  ensureFileSync
} from 'fs-extra/esm'
import { globSync } from 'tinyglobby'
import {
  box,
  cancel,
  confirm,
  group,
  groupMultiselect,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  select,
  taskLog,
  text
} from '@clack/prompts'

import { renderTemplate as renderTemplateFn } from './template.js'

const prompts = {
  text,
  confirm,
  select,
  multiselect,
  groupMultiselect,
  group,

  intro,
  outro,
  taskLog,
  log,
  note,
  box
}

const TEMPLATING_FILE_EXTENSIONS = [
  '',
  '.json',
  '.js',
  '.cjs',
  '.ts',
  '.vue',
  '.md',
  '.html',
  '.sass'
]

function cancelScaffolding(opts = {}) {
  // only the object form is valid; anything else (e.g. a plain string
  // message) would get silently dropped by the destructuring below
  if (typeof opts !== 'object' || opts === null) {
    throw new TypeError(
      'cancelScaffolding() expects an options object: { message?, exit? }'
    )
  }

  const { message = 'Scaffolding cancelled', exit = true } = opts

  cancel(message)
  if (exit !== false) process.exit(exit === true ? 1 : exit)
}

function exitOnCancel(val) {
  if (isCancel(val)) cancelScaffolding()
  return val
}

async function promptUser(
  scope,
  questions,
  onCancel = () => cancelScaffolding()
) {
  for (const key in questions) {
    // if it came pre-filled
    if (scope[key] !== void 0) continue

    scope[key] = await questions[key]()
    if (isCancel(scope[key])) {
      onCancel()
      return
    }
  }
}

function createTargetDir(scope) {
  const fn = scope.overwrite ? emptyDirSync : ensureDirSync
  fn(scope.projectFolder)
}

function convertArrayToObject(arr) {
  const acc = {}
  arr.forEach(key => {
    acc[key] = true
  })
  return acc
}

function getCallerPath() {
  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error('err').stack.slice(1)
  Error.prepareStackTrace = _prepareStackTrace
  const filename = stack[1].getFileName()
  return dirname(
    filename.startsWith('file://') ? fileURLToPath(filename) : filename
  )
}

function renderTemplate(relativePath, scope) {
  const templateDir = join(getCallerPath(), relativePath)
  const files = globSync(['**/*'], { cwd: templateDir })

  for (const rawPath of files) {
    const targetRelativePath = rawPath
      .split('/')
      .map(name => (name.startsWith('_') ? name.slice(1) : name))
      .join('/')

    const targetPath = resolve(scope.projectFolder, targetRelativePath)
    const sourcePath = resolve(templateDir, rawPath)
    const extension = extname(targetRelativePath)

    ensureFileSync(targetPath)

    if (TEMPLATING_FILE_EXTENSIONS.includes(extension)) {
      const rawContent = readFileSync(sourcePath, 'utf8')

      let newContent = renderTemplateFn(rawContent, scope)
      if (extension === '.json') {
        try {
          // try to format the JSON
          newContent = JSON.stringify(JSON.parse(newContent), null, 2)
        } catch {
          // noop, the JSON might be containing comments, leave it unformatted
        }
      }

      writeFileSync(targetPath, newContent, 'utf8')
    } else {
      copySync(sourcePath, targetPath)
    }
  }
}

function waitForKey() {
  const { stdin } = process

  // Are we in a real terminal?
  // If not (e.g., CI pipeline), resolve immediately so the script doesn't hang forever.
  if (!stdin.isTTY) return Promise.resolve()

  process.stdout.write('Press any key to continue...')

  const { promise, resolve: resolvePromise } = Promise.withResolvers()

  // Enable raw mode to bypass the 'Enter' key requirement
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')

  const handleKey = key => {
    stdin.off('data', handleKey)
    stdin.setRawMode(false)
    stdin.pause()

    // Explicitly handle Ctrl+C
    if (key === '\u0003') {
      console.log('\nProcess cancelled by user (Ctrl+C)\n')
      process.exit(1)
    }

    resolvePromise()
  }

  stdin.on('data', handleKey)
  return promise
}

function enterAlternateScreen(message) {
  // if we're not in a real terminal
  if (!process.stdin.isTTY) {
    if (message) console.log(`>>> ${message}\n`)
    return
  }

  // Enter Alternate Screen Buffer (hides current terminal history)
  process.stdout.write('\u001B[?1049h')
  // Move cursor to top left
  process.stdout.write('\u001B[H')

  if (message) console.log(`>>> ${message}\n`)
}

function exitAlternateScreen() {
  // if we're not in a real terminal
  if (!process.stdin.isTTY) return

  process.stdout.write('\u001B[?1049l')
}

async function runCommand({
  cmd,
  args,
  cwd,
  message,
  successMessage,
  errorMessage
}) {
  const logTask = taskLog({ title: message })
  enterAlternateScreen(`Running command: ${cmd} ${args.join(' ')}`)

  const runner = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    // Force colors so the captured error formatting isn't lost
    env: { ...process.env, FORCE_COLOR: '1' }
  })

  if (runner.error || runner.status) {
    const msg = `⚠️  ⚠️  ⚠️  ${errorMessage} ⚠️  ⚠️  ⚠️ `

    console.log()
    console.error(msg)
    console.log()

    await waitForKey()
    exitAlternateScreen()
    logTask.error(msg)

    return true
  }

  exitAlternateScreen()
  logTask.success(successMessage)

  return false
}

async function installDeps(scope) {
  const hadError = await runCommand({
    cmd: scope.install,
    args: ['install'],
    cwd: scope.projectFolder,
    message: `Installing dependencies using ${scope.install.toUpperCase()}...`,
    successMessage: 'Dependencies installed successfully!',
    errorMessage:
      'Could not auto install dependencies. Probably a temporary npm registry issue?'
  })

  if (hadError) {
    scope.install = false
    return false
  }

  return true
}

// returns a Promise!
// depends on install
function lintFolder(scope) {
  return runCommand({
    cmd: scope.install,
    args: ['run', 'lint'],
    cwd: scope.projectFolder,
    message: 'Linting & Formatting the project folder...',
    successMessage: 'Project linted & formatted successfully!',
    errorMessage: 'Could not auto lint & format the project folder.'
  })
}

function hasGit() {
  try {
    exec('git --version')
    return true
  } catch {}
}

function folderHasGit(cwd) {
  try {
    exec('git status', { stdio: 'ignore', cwd })
    return true
  } catch {}
}

function initializeGit(projectFolder) {
  if (hasGit() !== true) {
    log.info(
      'Git is not installed on the system, so skipping Git repo initialization.'
    )
    return
  }

  if (folderHasGit(projectFolder)) {
    log.info(
      'A parent of the project folder is already a Git repository, so skipping Git initialization.'
    )
    return
  }

  const logTask = taskLog({
    title: 'Initializing Git repository...'
  })

  try {
    let init = 'git init'
    try {
      exec('git config --get init.defaultBranch', {
        stdio: 'ignore',
        cwd: projectFolder
      })
    } catch {
      // the user has no configured branch name preference, so pin the
      // initial branch to "main" instead of the git version's own
      // default (also silences git's branch-name advice); git < 2.28
      // ignores the unknown config key without erroring
      init = 'git -c init.defaultBranch=main init'
    }

    exec(init, { cwd: projectFolder })
    exec('git add -A', { cwd: projectFolder })

    // Provide useful feedback to the user if they have GPG signing
    // enabled to avoid feeling that the process is hanging
    try {
      const needsSigning = exec('git config --get commit.gpgsign', {
        cwd: projectFolder
      })
        .toString()
        .trim()
      if (needsSigning === 'true') {
        logTask.message('Creating initial commit (waiting for GPG signing)...')
      }
    } catch {}

    exec('git commit -m "Initialize the project 🚀" --no-verify', {
      cwd: projectFolder
    })
  } catch {
    logTask.error(
      'Could not initialize Git repository. Please do this manually.'
    )
    return
  }

  logTask.success('Initialized Git repository 🚀')
}

async function getGitUser() {
  let name
  let email

  const { execSync } = await import('node:child_process')

  try {
    name = execSync('git config --get user.name')
    email = execSync('git config --get user.email')
  } catch {}

  if (!name && !email) return // user will be prompted

  return (
    (name ? JSON.stringify(name.toString().trim()).slice(1, -1) : '') +
    (email ? ' <' + email.toString().trim() + '>' : '')
  )
}

const definitions = {
  projectFolder: {
    default: 'quasar-project'
  },

  name: {
    default: projectFolderName =>
      projectFolderName
        .trim()
        .toLowerCase()
        .replaceAll(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replaceAll(/[^a-z0-9-~]+/g, '-'),

    isValid: name =>
      name &&
      name.length <= 214 &&
      name !== 'node_modules' &&
      /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
  },

  product: {
    default: 'Quasar App'
  },

  template: {
    default: 'app'
  }
}

export default {
  cancelScaffolding,
  exitOnCancel,

  promptUser,
  prompts,
  definitions,
  convertArrayToObject,

  createTargetDir,
  renderTemplate,

  installDeps,
  lintFolder,
  initializeGit,
  getGitUser
}
