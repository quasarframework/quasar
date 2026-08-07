import { spawn } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { ensureFreshBuild } from '../../../ui/build/build-stamp.js'

// Vitest global setup for the e2e suites, shared by create-quasar and
// the cli package (cli/vitest-e2e.config.js points here). Scaffolded
// projects must ALWAYS install the monorepo's own packages, never
// published ones: a throwaway Verdaccio registry is booted here, the
// monorepo packages are pnpm-published to it (real tarballs — files
// fields, .npmignore and workspace:^ rewrites are exercised), and every
// package manager the tests spawn is pointed at it through the
// environment (see the registry entries in e2e-utils.js).
//
// The monorepo packages are served WITHOUT an upstream proxy, so a
// version overlap with npmjs can never mask the local code; all other
// (third-party) packages are proxied through to npmjs.

const repoDir = join(import.meta.dirname, '../../..')

// name -> monorepo dir of every package a scaffolded project (or one of
// these packages itself) pulls from the registry
const localPackages = {
  quasar: 'ui',
  '@quasar/extras': 'extras',
  '@quasar/app-vite': 'app-vite',
  '@quasar/vite-plugin': 'vite-plugin',
  '@quasar/art': 'utils/art',
  '@quasar/render-ssr-error': 'utils/render-ssr-error',
  '@quasar/ssl-certificate': 'utils/ssl-certificate',
  '@quasar/update-notifier': 'utils/update-notifier'
}

// the ui package publishes its build output; everything else in
// localPackages ships committed sources/assets only
const uiBuildMarker = join(repoDir, 'ui/dist/quasar.client.js')

function run(cmd, args, cwd, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...extraEnv }
    })

    let output = ''
    child.stdout.on('data', chunk => {
      output += chunk
    })
    child.stderr.on('data', chunk => {
      output += chunk
    })

    child.on('error', reject)
    child.on('close', code => resolve({ code, output }))
  })
}

// Verifies a scaffolded project actually got the locally built quasar
// package and not a published one (e.g. a package manager ignoring the
// registry environment would silently fall back to npmjs). Byte-compares
// the installed main dist file against the repo's build. Throws (instead
// of using expect()) so the cli package can call it without importing
// create-quasar's vitest instance.
export function assertLocalQuasarInstall(projectFolder) {
  // apps install quasar at their root; scaffolded AEs only in their
  // playground
  const candidates = [projectFolder, join(projectFolder, 'playground')].map(
    dir => join(dir, 'node_modules/quasar/dist/quasar.client.js')
  )
  const installed = candidates.find(file => existsSync(file))

  if (installed === void 0) {
    throw new Error(
      `local registry: no installed quasar package found under ${projectFolder}`
    )
  }

  if (readFileSync(installed, 'utf8') !== readFileSync(uiBuildMarker, 'utf8')) {
    throw new Error(
      'local registry: the installed quasar package does not match the local' +
        ' ui build — the install bypassed the local registry'
    )
  }

  // Byte-equality alone passes spuriously whenever the local build is
  // identical to the published one (the norm right after a release), so
  // additionally require installation PROVENANCE: the package manager's
  // own metadata must reference the local registry (npm records it in
  // package-lock.json "resolved" URLs, yarn 1 in yarn.lock, pnpm in
  // node_modules/.modules.yaml "registries").
  const registryHost = process.env.E2E_REGISTRY_URL.replace(
    /^http:\/\//,
    ''
  ).replace(/\/$/, '')

  // <install root>/node_modules/quasar/dist/quasar.client.js
  const installRoot = join(installed, '../../../..')
  const provenanceFiles = [installRoot, projectFolder]
    .flatMap(dir => [
      join(dir, 'node_modules/.modules.yaml'),
      join(dir, 'package-lock.json'),
      join(dir, 'yarn.lock')
    ])
    .filter(file => existsSync(file))

  if (provenanceFiles.length === 0) {
    throw new Error(
      `local registry: no package manager metadata found under ${projectFolder}` +
        ' to prove the install went through the local registry'
    )
  }

  if (
    !provenanceFiles.some(file =>
      readFileSync(file, 'utf8').includes(registryHost)
    )
  ) {
    throw new Error(
      'local registry: the package manager metadata never references' +
        ` ${registryHost} — the install bypassed the local registry` +
        ` (checked: ${provenanceFiles.join(', ')})`
    )
  }
}

let extraUserCounter = 0

// Publishes an additional package directory into the running local
// registry (started by setup() in this same process group — reads the
// registry URL from the environment). Used by app-vite's AE-lifecycle
// e2e for its fixture extension. The directory is packed from a temp
// copy with any "private" flag stripped (so in-repo fixtures stay
// publish-protected) and an optional name override applied (so a
// fixture can publish under a scope its on-disk name does not carry).
export async function publishToLocalRegistry(dir, { name } = {}) {
  const registryUrl = process.env.E2E_REGISTRY_URL
  if (registryUrl === void 0) {
    throw new Error(
      'publishToLocalRegistry() needs the local registry started by setup()'
    )
  }

  const username = `e2e-extra-${process.pid}-${extraUserCounter++}`
  const userRes = await fetch(
    `${registryUrl}-/user/org.couchdb.user:${username}`,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: username, password: 'e2e-password' })
    }
  )
  const { token } = await userRes.json()
  if (!userRes.ok || !token) {
    throw new Error(
      `local registry: could not create a registry user (${userRes.status})`
    )
  }

  const packDir = mkdtempSync(join(tmpdir(), 'quasar-e2e-publish-'))
  try {
    cpSync(dir, packDir, { recursive: true })

    const packageFile = join(packDir, 'package.json')
    const { private: _, ...packageJson } = JSON.parse(
      readFileSync(packageFile, 'utf8')
    )
    if (name !== void 0) {
      packageJson.name = name
    }
    writeFileSync(packageFile, JSON.stringify(packageJson, null, 2) + '\n')

    const registryHost = registryUrl.replace(/^http:/, '')
    const { code, output } = await run(
      'pnpm',
      [
        'publish',
        '--registry',
        registryUrl,
        '--no-git-checks',
        '--ignore-scripts'
      ],
      packDir,
      { [`npm_config_${registryHost}:_authToken`]: token }
    )
    if (code !== 0) {
      throw new Error(
        `local registry: publishing ${packageJson.name} failed:\n${output}`
      )
    }
  } finally {
    rmSync(packDir, { recursive: true, force: true })
  }
}

export async function setup() {
  // a missing OR stale dist would publish old ui code to the registry
  ensureFreshBuild()

  const storageDir = mkdtempSync(join(tmpdir(), 'quasar-e2e-registry-'))

  const packages = {}
  for (const name of Object.keys(localPackages)) {
    // no "proxy" key: served exclusively from the local publishes
    packages[name] = { access: '$all', publish: '$authenticated' }
  }
  // app-vite's AE-lifecycle e2e publishes its fixture extension through
  // publishToLocalRegistry() below; local-only for the same reason, and
  // additionally under the org-owned @quasar scope so a name-squatted
  // npmjs package could never be substituted even if this rule got lost
  packages['@quasar/quasar-app-extension-qe2e'] = {
    access: '$all',
    publish: '$authenticated'
  }
  packages['**'] = { access: '$all', proxy: 'npmjs' }

  // loaded lazily: the cli package imports assertLocalQuasarInstall from
  // this file without needing verdaccio
  const { runServer } = await import('verdaccio')

  const app = await runServer({
    storage: storageDir,
    self_path: storageDir,
    uplinks: { npmjs: { url: 'https://registry.npmjs.org/' } },
    packages,
    auth: { htpasswd: { file: join(storageDir, 'htpasswd') } },
    log: { type: 'stdout', format: 'pretty', level: 'error' },
    web: { enable: false },
    // the default limit (10mb) rejects the @quasar/extras tarball
    max_body_size: '256mb'
  })

  // an explicit high user-range port instead of an OS-assigned one
  // (listen(0)): Linux's ephemeral range starts at 32768, and staying
  // above 40000 keeps well clear of any well-known/service ports;
  // random pick + retry handles concurrent e2e runs
  let server
  for (let attempt = 0; ; attempt++) {
    const port = 40_000 + Math.floor(Math.random() * 25_000)
    try {
      server = await new Promise((resolve, reject) => {
        const s = app.listen(port, '127.0.0.1', () => {
          resolve(s)
        })
        s.on('error', reject)
      })
      break
    } catch (err) {
      if (err.code !== 'EADDRINUSE' || attempt === 19) {
        rmSync(storageDir, { recursive: true, force: true })
        throw err
      }
    }
  }
  const registryUrl = `http://127.0.0.1:${server.address().port}/`

  const teardown = () => {
    server.close()
    rmSync(storageDir, { recursive: true, force: true })
  }

  // an open registry server would otherwise keep vitest alive
  // (and the storage dir around) when the setup fails midway
  try {
    const userRes = await fetch(`${registryUrl}-/user/org.couchdb.user:e2e`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'e2e', password: 'e2e-password' })
    })
    const { token } = await userRes.json()
    if (!userRes.ok || !token) {
      throw new Error(
        `local registry: could not create a registry user (${userRes.status})`
      )
    }

    const registryHost = registryUrl.replace(/^http:/, '')
    for (const [name, dir] of Object.entries(localPackages)) {
      const { code, output } = await run(
        'pnpm',
        // --ignore-scripts: prepublishOnly hooks would recursively run
        // builds and whole test suites; publishing here must stay a plain
        // "pack what is on disk" operation
        [
          'publish',
          '--registry',
          registryUrl,
          '--no-git-checks',
          '--ignore-scripts'
        ],
        join(repoDir, dir),
        { [`npm_config_${registryHost}:_authToken`]: token }
      )
      if (code !== 0) {
        throw new Error(`local registry: publishing ${name} failed:\n${output}`)
      }
    }
  } catch (err) {
    teardown()
    throw err
  }

  // pnpm and yarn 1 IGNORE the npm_config_registry environment variable
  // (npm honors it), so environment-only redirection silently leaks
  // installs to npmjs. The one channel all three package managers
  // respect is the user config: spawned processes get HOME pointed at a
  // controlled home dir whose .npmrc/.yarnrc pin the local registry.
  // The real store/cache paths are pinned back in, so tarball reuse
  // survives the home switch.
  const fakeHomeDir = join(storageDir, 'home')
  mkdirSync(fakeHomeDir)

  const realPaths = {}
  for (const [key, cmd, args] of [
    ['pnpmStore', 'pnpm', ['store', 'path']],
    ['npmCache', 'npm', ['config', 'get', 'cache']],
    ['yarnCache', 'yarn', ['cache', 'dir']]
  ]) {
    // tolerate an absent package manager; take the last output line
    // (some print banners/warnings before the path)
    const res = await run(cmd, args, repoDir).catch(() => ({ code: 1 }))
    realPaths[key] = res.code === 0 ? res.output.trim().split('\n').pop() : null
  }

  writeFileSync(
    join(fakeHomeDir, '.npmrc'),
    [
      `registry=${registryUrl}`,
      'update-notifier=false',
      ...(realPaths.pnpmStore ? [`store-dir=${realPaths.pnpmStore}`] : []),
      ...(realPaths.npmCache ? [`cache=${realPaths.npmCache}`] : []),
      ''
    ].join('\n')
  )
  writeFileSync(
    join(fakeHomeDir, '.yarnrc'),
    [
      `registry "${registryUrl}"`,
      ...(realPaths.yarnCache ? [`cache-folder "${realPaths.yarnCache}"`] : []),
      ''
    ].join('\n')
  )

  console.log(
    `local registry: serving ${Object.keys(localPackages).length}` +
      ` monorepo packages from ${registryUrl}`
  )

  // the test workers (and every process they spawn) pick these up
  // through their inherited environment (see the e2e-utils env objects)
  process.env.E2E_REGISTRY_URL = registryUrl
  process.env.E2E_REGISTRY_HOME = fakeHomeDir

  return teardown
}
