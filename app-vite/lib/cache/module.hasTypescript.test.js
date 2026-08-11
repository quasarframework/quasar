import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createInstance as createHasTypescript } from './module.hasTypescript.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-has-typescript-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeAppPaths(appDir) {
  return { appDir, resolve: { app: p => join(appDir, p) } }
}

// app with a tsconfig.json
const tsAppDir = join(rootDir, 'ts-app')
mkdirSync(tsAppDir, { recursive: true })
writeFileSync(join(tsAppDir, 'tsconfig.json'), '{}')

// app without a tsconfig.json
const plainAppDir = join(rootDir, 'plain-app')
mkdirSync(plainAppDir, { recursive: true })

describe('[module.hasTypescript.js]', () => {
  test('detects an app tsconfig.json', () => {
    expect(createHasTypescript({ appPaths: makeAppPaths(tsAppDir) })).toBe(true)
  })

  test('reports false without a tsconfig.json', () => {
    expect(createHasTypescript({ appPaths: makeAppPaths(plainAppDir) })).toBe(
      false
    )
  })
})
