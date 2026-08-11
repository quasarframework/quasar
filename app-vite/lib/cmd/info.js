import { gray, green } from 'kolorist'

import { getArgv } from '../utils/get-argv.js'
import { getPackageJson } from '../utils/get-package-json.js'

const argv = getArgv({
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Displays information about your machine and your Quasar App.

  Usage
    $ quasar info

  Options
    --no-color  Disable colored output
    --help, -h  Displays this message
  `)

  argv.__warn?.()
  process.exit(0)
}

import os from 'node:os'
import { existsSync } from 'node:fs'
import { sync as spawnSync } from 'cross-spawn'

import { getCtx } from '../utils/get-ctx.js'

const {
  appPaths,
  appExt: { extensionList }
} = getCtx()

function getSpawnOutput(command) {
  try {
    const child = spawnSync(command, ['--version'])
    return child.status === 0
      ? green(String(child.output[1]).trim())
      : gray('Not installed')
  } catch {
    return gray('Not installed')
  }
}

function safePkgInfo(pkg, dir) {
  const json = getPackageJson(pkg, dir)

  return json !== void 0
    ? {
        key: `  ${String(json.name).trim()}`,
        value: `${green(String(json.version).trim())}${json.description ? ` -- ${json.description}` : ''}`
      }
    : {
        key: `  ${pkg}`,
        value: gray('Not installed')
      }
}

function safeMultiPkgInfo(pkg, dirList) {
  for (const dir of dirList) {
    const json = getPackageJson(pkg, dir)

    if (json !== void 0) {
      return {
        key: `  ${String(json.name).trim()}`,
        value: `${green(String(json.version).trim())}${json.description ? ` -- ${json.description}` : ''}`
      }
    }
  }

  return {
    key: `  ${pkg}`,
    value: gray('Not installed')
  }
}

function print(m) {
  console.log(
    `${m.section ? '\n' : ''}${m.key}${m.value === void 0 ? '' : ' - ' + m.value}`
  )
}

print({
  key: 'Operating System',
  value: green(`${os.type()}(${os.release()}) - ${os.platform()}/${os.arch()}`),
  section: true
})
print({ key: 'Node.js', value: green(process.version.slice(1)) })
print({ key: 'Global packages', section: true })
print({ key: '  NPM', value: getSpawnOutput('npm') })
print({ key: '  yarn', value: getSpawnOutput('yarn') })
print({ key: '  pnpm', value: getSpawnOutput('pnpm') })
print({ key: '  bun', value: getSpawnOutput('bun') })
print({ key: '  @quasar/cli', value: green(process.env.QUASAR_CLI_VERSION) })
print({ key: '  @quasar/icongenie', value: getSpawnOutput('icongenie') })
print({ key: '  cordova', value: getSpawnOutput('cordova') })

// this section heading is pinned by info.test.js AND by the global
// CLI's e2e suite (cli/test/e2e/project.test.js) as the marker that
// the local CLI answered instead of the global fallback
print({ key: 'Important local packages', section: true })

;[
  'quasar',
  '@quasar/app-vite',
  '@quasar/extras',
  'vue',
  'vue-router',
  'pinia',
  'typescript'
].forEach(pkg => print(safePkgInfo(pkg, appPaths.appDir)))

;['vite', 'rolldown'].forEach(pkg =>
  print(safeMultiPkgInfo(pkg, [appPaths.appDir, appPaths.cliDir]))
)

if (existsSync(appPaths.pwaDir)) {
  ;['workbox-build', 'register-service-worker'].forEach(pkg =>
    print(safePkgInfo(pkg, appPaths.pwaDir))
  )
}

if (existsSync(appPaths.electronDir)) {
  ;['electron', '@electron/packager', 'electron-builder'].forEach(pkg =>
    print(safePkgInfo(pkg, appPaths.electronDir))
  )
}

if (existsSync(appPaths.capacitorDir)) {
  ;[
    '@capacitor/core',
    '@capacitor/cli',
    '@capacitor/android',
    '@capacitor/ios'
  ].forEach(pkg => print(safePkgInfo(pkg, appPaths.capacitorDir)))
}

print({ key: 'Quasar App Extensions', section: true })

if (extensionList.length !== 0) {
  extensionList.forEach(ext => {
    print(safePkgInfo(ext.packageName, appPaths.appDir))
  })
} else {
  print({ key: '  *None installed*' })
}

console.log()
