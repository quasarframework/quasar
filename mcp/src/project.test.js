import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, onTestFinished, test } from 'vitest'

import { loadProject } from './project.js'
import { createProject } from './test/fixture.js'

test('locates the installed docs packages, their slices and the API', () => {
  const dir = createProject()
  const project = loadProject(dir)

  expect(project.dir).toBe(dir)
  expect(project.packages.map(pkg => [pkg.name, pkg.version])).toEqual([
    ['quasar', '2.33.0'],
    ['@quasar/app-vite', '3.9.0']
  ])
  expect(project.packages[0].docsDir).toBe(
    join(dir, 'node_modules/quasar/dist/mcp')
  )
  expect(project.packages[0].apiDir).toBe(
    join(dir, 'node_modules/quasar/dist/api')
  )
  expect(project.packages[1].docsDir).toBe(
    join(dir, 'node_modules/@quasar/app-vite/dist/mcp')
  )
  expect(project.packages[1].apiDir).toBeNull()
})

test('a package that is not installed is left out', () => {
  const project = loadProject(createProject({ appVite: false }))
  expect(project.packages.map(pkg => pkg.name)).toEqual(['quasar'])
})

test('a release without bundled docs still serves its API', () => {
  const project = loadProject(createProject({ quasarDocs: false }))
  expect(project.packages[0].docsDir).toBeNull()
  expect(project.packages[0].apiDir).not.toBeNull()
})

test('a directory with no Quasar at all yields no packages', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quasar-mcp-empty-'))
  onTestFinished(() => {
    rmSync(dir, { recursive: true, force: true })
  })
  expect(loadProject(dir).packages).toEqual([])
})

test('a nested directory of the project finds the same packages', () => {
  const dir = createProject()
  const project = loadProject(join(dir, 'src', 'pages'))
  expect(project.packages.map(pkg => pkg.name)).toEqual([
    'quasar',
    '@quasar/app-vite'
  ])
})
