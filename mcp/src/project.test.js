import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, onTestFinished, test } from 'vitest'

import { loadProject } from './project.js'
import { createProject } from './test/fixture.js'

test('locates the installed docs packages, their slices and the API', () => {
  const dir = createProject()
  const project = loadProject(dir)

  expect(project.startDir).toBe(dir)
  expect(project.apps.length).toBe(1)
  const [{ dir: appDir, name, packages }] = project.apps
  expect(appDir).toBe(dir)
  expect(name).toBe('.')
  expect(packages.map(pkg => [pkg.name, pkg.version])).toEqual([
    ['quasar', '2.33.0'],
    ['@quasar/app-vite', '3.9.0']
  ])
  expect(packages[0].docsDir).toBe(join(dir, 'node_modules/quasar/dist/mcp'))
  expect(packages[0].apiDir).toBe(join(dir, 'node_modules/quasar/dist/api'))
  expect(packages[1].docsDir).toBe(
    join(dir, 'node_modules/@quasar/app-vite/dist/mcp')
  )
  expect(packages[1].apiDir).toBeNull()
})

test('a package that is not installed is left out', () => {
  const project = loadProject(createProject({ appVite: false }))
  expect(project.apps[0].packages.map(pkg => pkg.name)).toEqual(['quasar'])
})

test('a release without bundled docs still serves its API', () => {
  const [quasar] = loadProject(createProject({ quasarDocs: false })).apps[0]
    .packages
  expect(quasar.docsDir).toBeNull()
  expect(quasar.apiDir).not.toBeNull()
})

test('a directory with no Quasar at all yields no packages', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quasar-mcp-empty-'))
  onTestFinished(() => {
    rmSync(dir, { recursive: true, force: true })
  })
  expect(loadProject(dir).apps).toEqual([{ dir, name: '.', packages: [] }])
})

test('a nested directory of the project finds the same packages', () => {
  const dir = createProject()
  const project = loadProject(join(dir, 'src', 'pages'))
  expect(project.apps[0].packages.map(pkg => pkg.name)).toEqual([
    'quasar',
    '@quasar/app-vite'
  ])
})

function createWorkspace(apps, { manifest = 'pnpm-workspace.yaml' } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'quasar-mcp-workspace-'))
  onTestFinished(() => {
    rmSync(root, { recursive: true, force: true })
  })
  if (manifest !== null) {
    writeFileSync(join(root, manifest), '')
  }
  for (const app of apps) {
    createProject({ dir: join(root, app) })
  }
  return root
}

test('a directory with no manifest is not searched below: a home directory is not a workspace', () => {
  const root = createWorkspace(['apps/web'], { manifest: null })
  expect(loadProject(root).apps[0].packages).toEqual([])
  const withPackageJson = createWorkspace(['apps/web'], {
    manifest: 'package.json'
  })
  expect(loadProject(withPackageJson).apps[0].dir).toBe(
    join(withPackageJson, 'apps/web')
  )
})

test('a workspace root with one app below serves that app', () => {
  const root = createWorkspace(['apps/web'])
  const project = loadProject(root)
  expect(project.startDir).toBe(root)
  expect(project.apps.length).toBe(1)
  expect(project.apps[0].dir).toBe(join(root, 'apps/web'))
  expect(project.apps[0].name).toBe('apps/web')
  expect(project.apps[0].packages.map(pkg => pkg.name)).toEqual([
    'quasar',
    '@quasar/app-vite'
  ])
})

test('several apps below are all served, the first in path order by default', () => {
  const root = createWorkspace(['packages/site', 'apps/web', 'apps/admin'])
  const project = loadProject(root)
  expect(project.apps.map(app => app.name)).toEqual([
    'apps/admin',
    'apps/web',
    'packages/site'
  ])
  expect(project.apps.map(app => app.dir)).toEqual(
    project.apps.map(app => join(root, app.name))
  )
  for (const app of project.apps) {
    expect(
      app.packages.map(pkg => pkg.name),
      app.name
    ).toEqual(['quasar', '@quasar/app-vite'])
  }
})

test('a full app is served before a package that only depends on quasar', () => {
  const root = createWorkspace([])
  createProject({ dir: join(root, 'apps/web') })
  createProject({ dir: join(root, 'a-library'), appVite: false })
  const project = loadProject(root)
  expect(project.apps.map(app => app.name)).toEqual(['apps/web', 'a-library'])
})

test('the search below stops a few levels deep and skips build output', () => {
  const root = createWorkspace(['a/b/c/d/e/web', 'dist/web'])
  expect(loadProject(root).apps[0].packages).toEqual([])
  const near = createWorkspace(['a/b/c/web'])
  expect(loadProject(near).apps[0].dir).toBe(join(near, 'a/b/c/web'))
})
