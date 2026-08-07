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

// The freshness contract for ui/dist: the full build writes a stamp of
// its input hashes (script.build.js) and every test suite consuming
// the build verifies it before running (the vite-plugin/app-vite/docs
// global setups fail on a stale dist; the create-quasar/cli e2e local
// registry rebuilds instead) — so a forgotten rebuild after ui changes
// can never silently test old code.

const uiDir = join(import.meta.dirname, '..')
const repoDir = join(uiDir, '..')

// lives inside dist/ so the CI ui-dist cache and ui-build artifacts
// carry it along; NOT a dotfile (upload-artifact excludes hidden files
// by default) and excluded from the published package via "files"
export const stampFile = join(uiDir, 'dist/build-stamp.json')

// MUST mirror the ui-dist cache key of the CI workflows
// (the hashFiles(...) input list in .github/workflows) — keep in sync
const inputGroups = {
  'ui/src': join(uiDir, 'src'),
  'ui/lang': join(uiDir, 'lang'),
  'ui/icon-set': join(uiDir, 'icon-set'),
  'ui/build': join(uiDir, 'build'),
  'ui/package.json': join(uiDir, 'package.json'),
  'pnpm-lock.yaml': join(repoDir, 'pnpm-lock.yaml')
}

function hashTarget(target) {
  const hash = createHash('sha256')

  if (statSync(target).isDirectory()) {
    // forward-slash + sorted relative paths keep the digest identical
    // across operating systems
    const entries = readdirSync(target, { recursive: true })
      .map(entry => String(entry).replaceAll('\\', '/'))
      .sort()

    for (const entry of entries) {
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

// Builds the ui package when dist is missing or stale (per the stamp);
// a no-op when it is fresh. Returns whether a build ran. Shared by the
// dev scripts' CLI wrapper (ensure-fresh-build.js), the test global
// setups of the consuming packages and the e2e local registry — every
// ui/dist consumer self-heals instead of failing or silently testing
// stale code.
export function ensureFreshBuild() {
  const staleness = getBuildStaleness()
  if (staleness === null) return false

  console.log(`Building the ui package (${staleness})...`)
  const { status } = spawnSync('pnpm', ['build'], {
    cwd: uiDir,
    stdio: 'inherit'
  })
  if (status !== 0) {
    throw new Error(`The ui build failed (exit code ${status})`)
  }
  return true
}

// Returns null when dist matches the inputs it was built from,
// otherwise a human-readable reason
export function getBuildStaleness() {
  if (!existsSync(stampFile)) {
    return 'ui/dist carries no build stamp (partial or pre-stamp build)'
  }

  const stamped = JSON.parse(readFileSync(stampFile, 'utf8'))
  const current = computeInputHashes()
  const changed = Object.keys(current).filter(
    name => stamped[name] !== current[name]
  )

  return changed.length === 0
    ? null
    : `changed since ui/dist was built: ${changed.join(', ')}`
}
