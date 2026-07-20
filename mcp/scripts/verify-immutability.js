import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

import { sha256 } from './lib.js'

const projectRoot = resolve(import.meta.dirname, '..')
const sourceRoot = resolve(projectRoot, '..')

function trackedSourceHashes() {
  const paths = execFileSync('git', ['ls-files', '-z'], {
    cwd: sourceRoot,
    encoding: 'utf8'
  })
    .split('\0')
    .filter(path => path.length !== 0 && !path.startsWith('mcp/'))

  return Object.fromEntries(
    paths.map(path => [path, sha256(readFileSync(join(sourceRoot, path)))])
  )
}

const before = trackedSourceHashes()

execFileSync(process.execPath, [join(projectRoot, 'scripts/generate.js')], {
  cwd: sourceRoot,
  stdio: 'inherit'
})

const after = trackedSourceHashes()

if (JSON.stringify(before) !== JSON.stringify(after)) {
  throw new Error('Generation modified one or more tracked files outside mcp/')
}

process.stdout.write(
  `Verified that generation left ${Object.keys(before).length} tracked source files unchanged.\n`
)
