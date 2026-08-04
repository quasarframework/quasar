import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const backgroundCheckFlag = '--quasar-update-notifier-check'
const checkInterval = 24 * 60 * 60 * 1000
const moduleUrl = import.meta.url

function getCacheFile(packageName) {
  const cacheDir =
    process.env.XDG_CACHE_HOME ||
    process.env.LOCALAPPDATA ||
    join(homedir(), '.cache')

  return join(
    cacheDir,
    'quasar',
    'update-notifier',
    `${encodeURIComponent(packageName)}.json`
  )
}

function readCache(cacheFile) {
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8'))
  } catch {
    return void 0
  }
}

function writeCache(cacheFile, value) {
  try {
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(cacheFile, JSON.stringify(value))
  } catch {
    // An update check must never interfere with the command being run.
  }
}

function parseVersion(version) {
  if (typeof version !== 'string') return void 0

  const match = version.match(
    /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*)?$/
  )

  if (!match) return void 0

  return {
    core: match.slice(1, 4),
    prerelease: match[4]?.split('.')
  }
}

function compareNumeric(left, right) {
  if (left.length !== right.length) return left.length > right.length
  return left > right
}

export function isNewerVersion(latest, current) {
  const next = parseVersion(latest)
  const installed = parseVersion(current)

  if (!next || !installed) return false

  for (let index = 0; index < 3; index++) {
    if (next.core[index] !== installed.core[index]) {
      return compareNumeric(next.core[index], installed.core[index])
    }
  }

  if (!next.prerelease) return installed.prerelease !== void 0
  if (!installed.prerelease) return false

  const length = Math.max(next.prerelease.length, installed.prerelease.length)

  for (let index = 0; index < length; index++) {
    const nextId = next.prerelease[index]
    const installedId = installed.prerelease[index]

    if (nextId === installedId) continue
    if (nextId === void 0) return false
    if (installedId === void 0) return true

    const nextIsNumber = /^\d+$/.test(nextId)
    const installedIsNumber = /^\d+$/.test(installedId)

    if (nextIsNumber && installedIsNumber) {
      return compareNumeric(nextId, installedId)
    }

    if (nextIsNumber !== installedIsNumber) return installedIsNumber

    return nextId > installedId
  }

  return false
}

export function renderNotification({ current, latest, name }) {
  const command = `npm i -g ${name}`
  const firstLine = `Update available ${current} → ${latest}`
  const secondLine = `Run ${command} to update`
  const contentWidth = Math.max(firstLine.length, secondLine.length)
  const border = '─'.repeat(contentWidth + 2)
  const line = value => `│ ${value.padEnd(contentWidth)} │`

  return [`╭${border}╮`, line(firstLine), line(secondLine), `╰${border}╯`].join(
    '\n'
  )
}

function isDisabled() {
  const ci = process.env.CI

  return (
    'NO_UPDATE_NOTIFIER' in process.env ||
    process.env.NODE_ENV === 'test' ||
    (ci !== void 0 && ci !== '' && ci !== '0' && ci !== 'false') ||
    process.argv.includes('--no-update-notifier')
  )
}

export async function checkForUpdate({ cacheFile, name, version }) {
  const registry = new URL(
    process.env.npm_config_registry || 'https://registry.npmjs.org'
  )
  if (!registry.pathname.endsWith('/')) registry.pathname += '/'

  const packagePath = encodeURIComponent(name)
  const url = new URL(`-/package/${packagePath}/dist-tags`, registry)
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(30_000)
  })

  if (!response.ok) {
    throw new Error(`Registry responded with ${response.status}`)
  }

  const { latest } = await response.json()

  writeCache(cacheFile, {
    checkedAt: Date.now(),
    latest: isNewerVersion(latest, version) ? latest : void 0
  })
}

export function notifyUpdate({ name, version }) {
  if (!name || !version || isDisabled()) return

  const cacheFile = getCacheFile(name)
  const cache = readCache(cacheFile)
  const now = Date.now()

  if (!cache) {
    writeCache(cacheFile, { checkedAt: now })
    return
  }

  const latest = cache.latest
  if (latest !== void 0) {
    writeCache(cacheFile, { checkedAt: cache.checkedAt })
  }

  if (
    process.stdout.isTTY &&
    process.env.npm_lifecycle_event === void 0 &&
    isNewerVersion(latest, version)
  ) {
    const message = renderNotification({
      current: version,
      latest,
      name
    })
    process.once('exit', () => console.error(`\n${message}\n`))
  }

  if (now - cache.checkedAt < checkInterval) return

  spawn(
    process.execPath,
    [fileURLToPath(moduleUrl), backgroundCheckFlag, cacheFile, name, version],
    { detached: true, stdio: 'ignore' }
  ).unref()
}

if (process.argv[2] === backgroundCheckFlag) {
  const cacheFile = process.argv[3]
  const name = process.argv[4]
  const version = process.argv[5]

  try {
    await checkForUpdate({ cacheFile, name, version })
  } catch {
    // A background update check failing does not need to be reported.
  }

  process.exit()
}
