
import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    i: 'install',
    p: 'prerelease',
    m: 'major',
    h: 'help'
  },
  boolean: ['h', 'i', 'p', 'm']
})

if (argv.help) {
  console.log(`
  Description
    Upgrades all quasar packages to their latest version
    which are compatible with the API that you are currently using
    (unless -m/--major param is used which may include breaking changes).

    Works only in a project folder by upgrading to latest minor versions
    (or latest major versions if chosen to) of all quasar related packages.

    This will also upgrade official Quasar App Extensions.

  Usage
    # checks for non-breaking change upgrades and displays them,
    # but will not carry out the install
    $ quasar upgrade

    # checks for pre-releases (alpha/beta) also:
    $ quasar upgrade -p

    # checks for major new releases (includes breaking changes):
    $ quasar upgrade -m

    # to perform the actual upgrade,
    # combine any of the params above and add "-i" (or "--install"):
    $ quasar upgrade -i

  Options
    --install, -i     Also perform package upgrades
    --prerelease, -p  Allow pre-release versions (alpha/beta)
    --major, -m       Allow newer major versions (breaking changes)
    --help, -h        Displays this message
  `)
  process.exit(0)
}

import fs from 'node:fs'
import { join } from 'node:path'
import { green, red } from 'kolorist'
import { execSync } from 'node:child_process'

const { getProjectRoot } = await import('../get-project-root.js')
const root = getProjectRoot()

import { log, fatal } from '../logger.js'

if (!root) {
  fatal(`⚠️  Error. This command must be executed inside a Quasar project folder only.`)
}

if (!fs.existsSync(join(root, 'node_modules'))) {
  fatal('⚠️  Please run "yarn" / "npm install" / "pnpm install" first\n')
}

const pkg = JSON.parse(
  fs.readFileSync(join(root, 'package.json'), 'utf8')
)

const versionRegex = /^(\d+)\.[\d]+\.[\d]+-?(alpha|beta|rc)?/

function getLatestVersion (packager, packageName, curVersion) {
  let versions

  try {
    versions = JSON.parse(
      execSync(
        `${packager} info ${packageName} versions --json`,
        { stdio: ['ignore', 'pipe', 'pipe'] }
      )
    )
  }
  catch (err) {
    return null
  }

  if (versions.type === 'error') {
    return null
  }

  if (packager === 'yarn') {
    versions = versions.data
  }

  if (curVersion === null) {
    return versions[versions.length - 1]
  }

  const [, major, prerelease] = curVersion.match(versionRegex)
  const majorSyntax = argv.major ? `(\\d+)` : major
  const regex = new RegExp(
    prerelease || argv.prerelease
      ? `^${majorSyntax}\\.(\\d+)\\.(\\d+)-?(alpha|beta|rc)?`
      : `^${majorSyntax}\\.(\\d+)\\.(\\d+)$`
  )

  versions = versions.filter(version => regex.test(version))

  return versions[versions.length - 1]
}

const deps = {
  dependencies: [],
  devDependencies: []
}

const packager = (await import('../node-packager.js')).getNodePackager(root)
const getPackageJson = (await import('../get-package-json.js')).getPackageJson(root)

console.log()
log(`Gathering information with ${packager}...`)
console.log()

let updateAvailable = false
let removeDeprecatedAppPkg = false

for (const type of Object.keys(deps)) {
  for (let packageName of Object.keys(pkg[type] || {})) {
    // is it a Quasar package?
    if (packageName !== 'quasar' && packageName !== 'eslint-plugin-quasar' && !packageName.startsWith('@quasar/')) {
      continue
    }

    const json = getPackageJson(packageName)
    const curVersion = json
      ? json.version
      : null

    // q/app v3 has been renamed to q/app-webpack
    if (packageName === '@quasar/app' && curVersion && curVersion.startsWith('3.')) {
      removeDeprecatedAppPkg = true
      packageName = '@quasar/app-webpack'
    }

    const latestVersion = getLatestVersion(packager, packageName, curVersion)

    const current = curVersion === null
      ? red('Missing!')
      : curVersion

    if (latestVersion === null) {
      console.log(` ${green(packageName)}: ${current} → ${red('Skipping!')}`)
      console.log(`   (⚠️  NPM registry server returned an error, so we cannot detect latest version)`)
    }
    else if (curVersion !== latestVersion) {
      deps[type].push({
        packageName,
        latestVersion
      })

      updateAvailable = true

      console.log(` ${green(packageName)}: ${current} → ${latestVersion}`)
    }
  }
}

if (!updateAvailable) {
  // The string `Congrats!` in the following log line is parsed by
  // @quasar/wizard AE. Do not change under any circumstances.
  console.log('  Congrats! All Quasar packages are up to date.\n')
  process.exit(0)
}

if (!argv.install) {
  const params = [ '-i' ]
  argv.prerelease && params.push('-p')
  argv.major && params.push('-m')

  console.log()
  console.log(` See ${green('https://quasar.dev/start/release-notes')} for release notes.`)
  console.log(` Run "quasar upgrade ${params.join(' ')}" to do the actual upgrade.`)
  console.log()
  process.exit(0)
}

const { default: { removeSync } } = await import('fs-extra')
const { spawn } = await import('../spawn.js')

if (removeDeprecatedAppPkg === true) {
  const params = packager === 'yarn' || packager === 'pnpm'
    ? [ 'remove', '@quasar/app' ]
    : [ 'uninstall', '--save-dev', '@quasar/app' ]

  console.log()
  spawn(packager, params, root)

  // need to delete the package otherwise
  // installing the new version might fail on Windows;
  removeSync(join(root, 'node_modules/@quasar/app'))

  const tsConfigFile = join(root, 'tsconfig.json')
  if (fs.existsSync(tsConfigFile) === true) {
    const content = fs.readFileSync(tsConfigFile, 'utf-8')
    fs.writeFileSync(
      tsConfigFile,
      content.replace('"@quasar/app/tsconfig-preset"', '"@quasar/app-webpack/tsconfig-preset"'),
      'utf-8'
    )
  }

  const quasarDTsFile = join(root, 'src/quasar.d.ts')
  if (fs.existsSync(quasarDTsFile) === true) {
    const content = fs.readFileSync(quasarDTsFile, 'utf-8')
    fs.writeFileSync(
      quasarDTsFile,
      content.replace('"@quasar/app"', '"@quasar/app-webpack"'),
      'utf-8'
    )
  }
}

for (const type of Object.keys(deps)) {
  if (deps[type].length === 0) {
    continue
  }

  const params = packager === 'yarn'
    ? (type === 'devDependencies' ? [ 'add', '--dev' ] : [ 'add' ])
    : (
      packager === 'pnpm'
        ? [ 'install' ]
        : [ 'install', `--save${type === 'devDependencies' ? '-dev' : ''}` ] // npm
    )

  deps[type].forEach(dep => {
    // need to delete tha package otherwise
    // installing the new version might fail on Windows
    removeSync(join(root, 'node_modules', dep.packageName))

    const pinned = /^\d/.test(
      pkg.dependencies[dep.packageName] ||
      pkg.devDependencies[dep.packageName] ||
      '^' // fallback, just in case
    )

    params.push(`${dep.packageName}@${pinned ? '' : '^'}${dep.latestVersion}`)
  })

  console.log()
  spawn(packager, params, root)
}

console.log()
log('Successfully upgraded Quasar packages.\n')
