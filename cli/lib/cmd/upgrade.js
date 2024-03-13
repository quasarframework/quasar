import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    i: 'install',
    p: 'prerelease',
    m: 'major',
    r: 'registry',
    h: 'help'
  },
  boolean: [ 'h', 'i', 'p', 'm' ]
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
    --registry, -r    NPM registry URL
                        * default is taken from your machine's npm config
                        * example: https://registry.npmjs.org/
    --help, -h        Displays this message
  `)
  process.exit(0)
}

import fs from 'node:fs'
import { green, red } from 'kolorist'

import appPaths from '../app-paths.js'
import { log, fatal, success } from '../logger.js'

if (appPaths.appDir === void 0) {
  fatal('This command must be executed inside a Quasar project folder only.', 'Error')
}

if (!fs.existsSync(appPaths.resolve.app('node_modules'))) {
  fatal('Please run npm/yarn/pnpm/bun install first\n', 'Error')
}

import { appPkg } from '../app-pkg.js'

const deps = {
  dependencies: [],
  devDependencies: []
}

import { nodePackager } from '../node-packager.js'
import { getPackageJson } from '../get-package-json.js'

if (argv.registry) {
  nodePackager.npmRegistryUrl = argv.registry
}

console.log()
log(`Gathering information from the NPM registry (${ nodePackager.npmRegistryUrl })...`)
console.log()

let quasarVersion = null
let updateAvailable = false
let skippedVersions = false
let removeDeprecatedAppPkg = false

for (const type of Object.keys(deps)) {
  for (let packageName of Object.keys(appPkg[ type ] || {})) {
    // is it a Quasar package?
    if (packageName !== 'quasar' && packageName !== 'eslint-plugin-quasar' && !packageName.startsWith('@quasar/')) {
      continue
    }

    const json = getPackageJson(packageName)
    const currentVersion = json
      ? json.version
      : null

    // q/app v3 has been renamed to q/app-webpack
    if (packageName === '@quasar/app' && currentVersion && currentVersion.startsWith('3.')) {
      removeDeprecatedAppPkg = true
      packageName = '@quasar/app-webpack'
    }

    const latestVersion = await nodePackager.getPackageLatestVersion({
      packageName,
      currentVersion,
      majorVersion: argv.major,
      preReleaseVersion: argv.prerelease
    })

    const current = currentVersion === null
      ? red('Missing!')
      : currentVersion

    if (latestVersion === null) {
      console.log(` ${ green(packageName) }: ${ current } → ${ red('Skipping!') }`)
      console.log(`   (⚠️  NPM registry server (${ nodePackager.npmRegistryUrl }) an error, so we cannot detect latest version)`)
      skippedVersions = true
    }
    else if (currentVersion !== latestVersion) {
      deps[ type ].push({
        packageName,
        latestVersion
      })

      updateAvailable = true

      console.log(` ${ green(packageName) }: ${ current } → ${ latestVersion }`)
    }

    if (packageName === 'quasar') {
      quasarVersion = latestVersion
    }
  }
}

if (!updateAvailable) {
  if (skippedVersions) {
    fatal(`Some packages were skipped due to errors in the NPM registry server (${ nodePackager.npmRegistryUrl }). Please try again later.\n`)
  }
  else {
    log(`Congrats! All Quasar packages are up to date (according to ${ nodePackager.npmRegistryUrl }).\n`)
  }

  process.exit(0)
}

function getQuasarVersionPrefix (version) {
  if (!version) return ''

  const matches = version.match(/^(\d)/)
  if (!matches || !matches[ 1 ]) return ''

  const major = parseInt(matches[ 1 ], 10)
  return isNaN(major) ? '' : `v${ major }.`
}

console.log()
console.log(` Used ${ nodePackager.npmRegistryUrl } to check for latest versions.`)

if (!argv.install) {
  const params = [ '-i' ]
  argv.prerelease && params.push('-p')
  argv.major && params.push('-m')

  const urlPrefix = argv.major
    ? ''
    : getQuasarVersionPrefix(quasarVersion)

  console.log(` See ${ green(`https://${ urlPrefix }quasar.dev/start/release-notes`) } for release notes.`)
  console.log(` Run "quasar upgrade ${ params.join(' ') }" to do the actual upgrade.`)
  console.log()
  process.exit(0)
}

const { default: { removeSync } } = await import('fs-extra')

if (removeDeprecatedAppPkg === true) {
  console.log()
  nodePackager.uninstallPackage('@quasar/app', { displayName: 'deprecated @quasar/app' })

  // need to delete the package otherwise
  // installing the new version might fail on Windows;
  removeSync(appPaths.resolve.app('node_modules/@quasar/app'))

  const tsConfigFile = appPaths.resolve.app('tsconfig.json')
  if (fs.existsSync(tsConfigFile) === true) {
    const content = fs.readFileSync(tsConfigFile, 'utf-8')
    fs.writeFileSync(
      tsConfigFile,
      content.replace('"@quasar/app/tsconfig-preset"', '"@quasar/app-webpack/tsconfig-preset"'),
      'utf-8'
    )
  }

  const quasarDTsFile = appPaths.resolve.app('src/quasar.d.ts')
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
  if (deps[ type ].length === 0) {
    continue
  }

  const packageList = []

  deps[ type ].forEach(dep => {
    // need to delete tha package otherwise
    // installing the new version might fail on Windows
    removeSync(appPaths.resolve.app('node_modules/' + dep.packageName))

    const pinned = /^\d/.test(
      appPkg.dependencies[ dep.packageName ]
      || appPkg.devDependencies[ dep.packageName ]
      || '^' // fallback, just in case
    )

    packageList.push(
      `${ dep.packageName }@${ pinned ? '' : '^' }${ dep.latestVersion }`
    )
  })

  console.log()
  nodePackager.installPackage(
    packageList,
    {
      displayName: packageList.join(' ') + (type === 'devDependencies' ? ' as devDependencies' : ''),
      isDevDependency: type === 'devDependencies'
    }
  )
}

console.log()

if (skippedVersions) {
  fatal(`Partially upgraded Quasar packages. Some of them were skipped due to errors in the NPM registry server (${ nodePackager.npmRegistryUrl }). Please try again later for those ones.`)
}
else {
  success(`Successfully upgraded Quasar packages (using npm registry: ${ nodePackager.npmRegistryUrl }).\n`)
}
