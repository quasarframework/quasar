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

function createWorkspace(apps) {
  const root = mkdtempSync(join(tmpdir(), 'quasar-mcp-workspace-'))
  onTestFinished(() => {
    rmSync(root, { recursive: true, force: true })
  })
  for (const app of apps) {
    createProject({ dir: join(root, app) })
  }
  return root
}

test('a workspace root with one app below serves that app', () => {
  const root = createWorkspace(['apps/web'])
  const project = loadProject(root)
  expect(project.startDir).toBe(root)
  expect(project.dir).toBe(join(root, 'apps/web'))
  expect(project.otherApps).toEqual([])
  expect(project.packages.map(pkg => pkg.name)).toEqual([
    'quasar',
    '@quasar/app-vite'
  ])
})

test('several apps below: the first in path order is served, the others reported', () => {
  const root = createWorkspace(['packages/site', 'apps/web', 'apps/admin'])
  const project = loadProject(root)
  expect(project.dir).toBe(join(root, 'apps/admin'))
  expect(project.otherApps).toEqual([
    join(root, 'apps/web'),
    join(root, 'packages/site')
  ])
})

test('a directory given explicitly is served as is, no app is looked for below it', () => {
  const root = createWorkspace(['apps/web'])
  const project = loadProject(root, { explicit: true })
  expect(project.dir).toBe(root)
  expect(project.packages).toEqual([])
})

test('the search below stops a few levels deep and skips build output', () => {
  const root = createWorkspace(['a/b/c/d/e/web', 'dist/web'])
  expect(loadProject(root).packages).toEqual([])
  const near = createWorkspace(['a/b/c/web'])
  expect(loadProject(near).dir).toBe(join(near, 'a/b/c/web'))
})
