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

import { createInstance as createCssVariables } from './module.cssVariables.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-css-variables-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeAppDir(name) {
  const dir = join(rootDir, name)
  mkdirSync(dir, { recursive: true })
  return dir
}

function makeAppPaths(appDir) {
  return { appDir, resolve: { app: p => join(appDir, p) } }
}

describe('[module.cssVariables.js]', () => {
  test('defaults to css without a variables file', () => {
    const appDir = makeAppDir('plain-app')

    expect(createCssVariables({ appPaths: makeAppPaths(appDir) })).toEqual({
      quasarSrcExt: 'css',
      variablesFile: false
    })
  })

  test('detects an scss variables file', () => {
    const appDir = makeAppDir('css-scss-app')
    mkdirSync(join(appDir, 'src', 'css'), { recursive: true })
    writeFileSync(join(appDir, 'src', 'css', 'quasar.variables.scss'), '')

    expect(createCssVariables({ appPaths: makeAppPaths(appDir) })).toEqual({
      quasarSrcExt: 'sass',
      variablesFile: '@/css/quasar.variables.scss'
    })
  })

  test('detects a sass variables file', () => {
    const appDir = makeAppDir('css-sass-app')
    mkdirSync(join(appDir, 'src', 'css'), { recursive: true })
    writeFileSync(join(appDir, 'src', 'css', 'quasar.variables.sass'), '')

    expect(createCssVariables({ appPaths: makeAppPaths(appDir) })).toEqual({
      quasarSrcExt: 'sass',
      variablesFile: '@/css/quasar.variables.sass'
    })
  })

  test('prefers scss when both variables files exist', () => {
    const appDir = makeAppDir('css-both-app')
    mkdirSync(join(appDir, 'src', 'css'), { recursive: true })
    writeFileSync(join(appDir, 'src', 'css', 'quasar.variables.scss'), '')
    writeFileSync(join(appDir, 'src', 'css', 'quasar.variables.sass'), '')

    const cssVariables = createCssVariables({ appPaths: makeAppPaths(appDir) })
    expect(cssVariables.variablesFile).toBe('@/css/quasar.variables.scss')
  })
})
