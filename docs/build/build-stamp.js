import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'

// The freshness contract for the docs site build, mirroring the ui
// package's (see /ui/build/build-stamp.js): the full build writes a
// stamp of its input hashes, and test:build skips the minutes-long
// SSG build when they are unchanged. The ui/dist dependency is
// represented by ui's own stamp file — its content changes exactly
// when ui/dist legitimately changes.

const docsDir = join(import.meta.dirname, '..')
const repoDir = join(docsDir, '..')

// lives inside dist/ (gitignored; `quasar clean` wiping it just means
// the next check rebuilds)
export const stampFile = join(docsDir, 'dist/build-stamp.json')

const inputGroups = {
  'docs/build': join(docsDir, 'build'),
  'docs/src': join(docsDir, 'src'),
  'docs/public': join(docsDir, 'public'),
  'docs/index.html': join(docsDir, 'index.html'),
  'docs/package.json': join(docsDir, 'package.json'),
  'docs/quasar.config.js': join(docsDir, 'quasar.config.js'),
  'pnpm-lock.yaml': join(repoDir, 'pnpm-lock.yaml'),
  'ui/dist/build-stamp.json': join(repoDir, 'ui/dist/build-stamp.json')
}

// None of the input groups tracks a dotfile, so what turns up under one is
// an OS or editor dropping (.DS_Store, .eslintcache, .vscode/) that git
// ignores and a CI checkout never has. Hashing those would let a Finder
// visit read as a source change — a needless multi-minute rebuild — and
// would put this digest permanently out of step with the workflows' key.
const isDroppingPath = entry =>
  entry.split('/').some(part => part.startsWith('.'))

function hashTarget(target) {
  const hash = createHash('sha256')

  if (!existsSync(target)) {
    // the ui stamp may be legitimately absent (partial/aborted ui
    // build) — hash to a constant so the docs stamp still resolves;
    // the ui self-heal settles it before any build consumes it
    hash.update('missing')
    return hash.digest('hex')
  }

  if (statSync(target).isDirectory()) {
    // forward-slash + sorted relative paths keep the digest identical
    // across operating systems
    const entries = readdirSync(target, { recursive: true })
      .map(entry => String(entry).replaceAll('\\', '/'))
      .sort()

    for (const entry of entries) {
      if (isDroppingPath(entry)) continue
      const file = join(target, entry)
      if (!statSync(file).isFile()) continue
      hash.update(entry)
      hash.update('\0')
      hash.update(readFileSync(file))
    }
  } else {
    hash.update(readFileSync(target))
  }

  return hash.digest('hex')
}

function computeInputHashes() {
  const result = {}
  for (const [name, target] of Object.entries(inputGroups)) {
    result[name] = hashTarget(target)
  }
  return result
}

export function writeBuildStamp() {
  writeFileSync(stampFile, JSON.stringify(computeInputHashes(), null, 2) + '\n')
}

// Builds the docs site when its output is missing or stale (per the
// stamp); a no-op when it is fresh. Returns whether a build ran.
export function ensureFreshBuild() {
  const staleness = getBuildStaleness()
  if (staleness === null) return false

  console.log(`Building the docs site (${staleness})...`)
  const { status } = spawnSync('pnpm', ['build'], {
    cwd: docsDir,
    stdio: 'inherit'
  })
  if (status !== 0) {
    throw new Error(`The docs build failed (exit code ${status})`)
  }

  writeBuildStamp()
  return true
}

// Returns null when the last build matches the current inputs,
// otherwise a human-readable reason
export function getBuildStaleness() {
  if (!existsSync(stampFile)) {
    return 'docs/dist carries no build stamp (clean or pre-stamp build)'
  }

  const stamped = JSON.parse(readFileSync(stampFile, 'utf8'))
  const current = computeInputHashes()
  const changed = Object.keys(current).filter(
    name => stamped[name] !== current[name]
  )

  return changed.length === 0
    ? null
    : `changed since the last build: ${changed.join(', ')}`
}
