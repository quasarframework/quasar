import { getArgv } from '../get-argv.js'

const argv = getArgv({
  install: { type: 'boolean', short: 'i' },
  prerelease: { type: 'boolean', short: 'p' },
  major: { type: 'boolean', short: 'm' },
  registry: { type: 'string', short: 'r' },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Upgrades all Quasar packages to their latest version
    which are compatible with the API that you are currently using
    (unless -m/--major param is used which may include breaking changes).

    Works only in a project folder by upgrading to latest minor versions
    (or latest major versions if chosen to) of all Quasar related packages.

    This will also upgrade official Quasar App Extensions.

  Usage
    # will prompt you to install
    $ quasar upgrade

    # checks for pre-releases (alpha/beta/rc) also:
    $ quasar upgrade -p

    # checks for major new releases (includes breaking changes):
    $ quasar upgrade -m

    # to skip the install prompt and just do it,
    # combine any of the params above and add "-i" (or "--install"):
    $ quasar upgrade -i

  Options
    --install, -i     Skips the install prompt and just does it
    --prerelease, -p  Allow pre-release versions (alpha/beta/rc)
    --major, -m       Allow newer major versions (breaking changes)
    --registry, -r    NPM registry URL
                        * default is taken from your machine's npm config
                        * example: https://registry.npmjs.org/
    --no-color        Disable colored output
    --help, -h        Displays this message
  `)

  argv.__warn?.()
  process.exit(0)
}

import fs from 'node:fs'
import { green, red } from 'kolorist'

const { default: appPaths } = await import('../app-paths.js')
const { createPromptSession } = await import('../logger.js')

const promptSession = await createPromptSession('Quasar Packages Upgrade')

if (appPaths.appDir === void 0) {
  promptSession.cancel(
    'This command must be executed inside a Quasar project folder only.'
  )
  process.exit(1)
}

if (!fs.existsSync(appPaths.resolve.app('node_modules'))) {
  promptSession.cancel('Please run pnpm/yarn/npm/bun install first.')
  process.exit(1)
}

const { appPkg } = await import('../app-pkg.js')

const deps = {
  dependencies: [],
  devDependencies: []
}

const { nodePackager } = await import('../node-packager.js')
const { getPackageJson } = await import('../get-package-json.js')

if (argv.registry) {
  nodePackager.npmRegistryUrl = argv.registry
}

promptSession.log.info(
  `Using NPM registry: ${green(nodePackager.npmRegistryUrl)}`
)

let quasarVersion = null
let updateAvailable = false
let skippedVersions = false

const taskList = []
const getVersionTask = async (
  depsTarget,
  packageName,
  currentVersion,
  currentVersionLabel
) => {
  const latestVersion = await nodePackager.getPackageLatestVersion({
    packageName,
    currentVersion,
    majorVersion: argv.major,
    preReleaseVersion: argv.prerelease
  })

  if (latestVersion === null) {
    skippedVersions = true
    return (
      `${green(packageName)}: ${currentVersionLabel} → ${red('Skipping!')}` +
      ` - NPM registry returned an error`
    )
  }

  if (packageName === 'quasar') {
    quasarVersion = latestVersion
  }

  if (currentVersion !== latestVersion) {
    depsTarget.push({
      packageName,
      latestVersion
    })

    updateAvailable = true
    return `${green(packageName)}: ${currentVersionLabel} → ${green(latestVersion)}`
  }

  return `${green(packageName)}: ${currentVersionLabel} ✅ `
}

for (const type of Object.keys(deps)) {
  for (const packageName of Object.keys(appPkg[type] || {})) {
    // is it a Quasar package?
    if (
      packageName !== 'quasar' &&
      packageName !== 'eslint-plugin-quasar' &&
      !packageName.startsWith('@quasar/')
    ) {
      continue
    }

    const json = getPackageJson(packageName)
    const curVersion = json?.version || null
    const curVersionLabel = curVersion === null ? red('Missing!') : curVersion

    taskList.push(
      // oxlint-disable-next-line unicorn/prefer-top-level-await
      getVersionTask(deps[type], packageName, curVersion, curVersionLabel)
    )
  }
}

let summary
await promptSession.tasks([
  {
    title: 'Checking NPM registry for updates...',
    task: async () => {
      summary = await Promise.all(taskList)
      return `Inquired NPM registry for updates`
    }
  }
])

promptSession.note(summary.join('\n'), 'Summary:')

if (!updateAvailable) {
  if (skippedVersions) {
    promptSession.cancel(
      `Some packages were skipped due to errors in the NPM registry server. Please try again later.`
    )
    process.exit(1)
  }

  promptSession.outro(`Congrats! All Quasar packages are up to date. ✅ `)
  process.exit(0)
}

function getQuasarVersionPrefix(version) {
  if (!version) return ''

  const matches = version.match(/^(\d+)/)
  if (!matches || !matches[1]) return ''

  const major = Number.parseInt(matches[1], 10)
  return Number.isNaN(major) ? '' : `v${major}.`
}

if (!argv.install) {
  const params = ['-i']
  if (argv.prerelease) params.push('-p')
  if (argv.major) params.push('-m')

  const urlPrefix = argv.major ? '' : getQuasarVersionPrefix(quasarVersion)

  if (
    process.stdout.isTTY &&
    (await import('ci-info').then(({ isCI }) => !isCI))
  ) {
    const initialValues = Object.keys(deps)
      .reduce((acc, type) => {
        acc.push(...deps[type])
        return acc
      }, [])
      .map(dep => dep.packageName)

    const { packageList } = await promptSession.prompt({
      packageList: () =>
        promptSession.multiselect({
          message: `Pick packages to upgrade (unselect all to skip):`,
          initialValues,
          required: false,
          options: Object.keys(deps).reduce(
            (acc, type) => [
              ...acc,
              ...deps[type].map(dep => ({
                value: dep.packageName,
                label: `${dep.packageName} (${green(dep.latestVersion)})`
              }))
            ],
            []
          )
        })
    })

    if (packageList.length !== 0) {
      argv.install = true

      if (packageList.length !== initialValues.length) {
        Object.keys(deps).forEach(type => {
          deps[type] = deps[type].filter(dep =>
            packageList.includes(dep.packageName)
          )
        })
      }
    }
  }

  if (!argv.install) {
    promptSession.note(
      `See ${green(`https://${urlPrefix}quasar.dev/start/release-notes`)} for release notes.` +
        `\nRun "quasar upgrade ${params.join(' ')}" to do the upgrade.`,
      'Please note:'
    )
    promptSession.outro('Thank you!')
    process.exit(0)
  }
}

const {
  default: { removeSync }
} = await import('fs-extra')

for (const type of Object.keys(deps)) {
  if (deps[type].length === 0) continue

  const packageList = []

  deps[type].forEach(dep => {
    // need to delete tha package otherwise
    // installing the new version might fail on Windows
    removeSync(appPaths.resolve.app('node_modules/' + dep.packageName))

    const pinned = /^\d/.test(
      appPkg.dependencies[dep.packageName] ||
        appPkg.devDependencies[dep.packageName] ||
        '^' // fallback, just in case
    )

    packageList.push(
      `${dep.packageName}@${pinned ? '' : '^'}${dep.latestVersion}`
    )
  })

  await nodePackager.installPackage(packageList, {
    isDevDependency: type === 'devDependencies'
  })
}

if (skippedVersions) {
  promptSession.outro(
    `⚠️  Partially upgraded Quasar packages. Some of them were skipped due to errors in the NPM registry server (${nodePackager.npmRegistryUrl}). Please try again later for those ones.`
  )
  process.exit(1)
} else {
  promptSession.outro(`Upgraded Quasar packages ✅ `)
}
