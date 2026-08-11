import { describe, expect, test } from 'vitest'

import { createInstance as createElectron } from './module.electron.js'

describe('[module.electron.js]', () => {
  // never touched on disk; only used as the install cwd
  const electronDir = '/fake-app/src-electron'

  function createElectronInstance(electronPkg, installedPackages = []) {
    const fakeNodePackager = {
      installPackage: (name, opts) => {
        installedPackages.push({ name, opts })
        return Promise.resolve()
      }
    }

    return createElectron({
      appPaths: { electronDir },
      pkg: { electronPkg },
      cacheProxy: { getModule: () => Promise.resolve(fakeNodePackager) }
    })
  }

  test('detects a bundler in devDependencies or dependencies', async () => {
    const devDepsInstance = await createElectronInstance({
      devDependencies: { 'electron-builder': '^26.0.12' }
    })
    const depsInstance = await createElectronInstance({
      dependencies: { '@electron/packager': '^20.0.0' }
    })

    expect(devDepsInstance.bundlerIsInstalled('builder')).toBe(true)
    expect(devDepsInstance.bundlerIsInstalled('packager')).toBe(false)
    expect(depsInstance.bundlerIsInstalled('packager')).toBe(true)
  })

  test('getDefaultName prefers packager, then builder, then packager', async () => {
    const packagerInstance = await createElectronInstance({
      devDependencies: {
        '@electron/packager': '^20.0.0',
        'electron-builder': '^26.0.12'
      }
    })
    const builderInstance = await createElectronInstance({
      devDependencies: { 'electron-builder': '^26.0.12' }
    })
    const bareInstance = await createElectronInstance({})

    expect(packagerInstance.getDefaultName()).toBe('packager')
    expect(builderInstance.getDefaultName()).toBe('builder')
    expect(bareInstance.getDefaultName()).toBe('packager')
  })

  test('ensureInstall installs a missing bundler with a pinned range', async () => {
    const installedPackages = []
    const instance = await createElectronInstance({}, installedPackages)

    await instance.ensureInstall('packager')

    expect(installedPackages).toEqual([
      {
        name: '@electron/packager@^20.0.0',
        opts: { cwd: electronDir, isDevDependency: true }
      }
    ])
  })

  test('ensureInstall is a no-op when the bundler is already installed', async () => {
    const installedPackages = []
    const instance = await createElectronInstance(
      { devDependencies: { 'electron-builder': '^26.0.12' } },
      installedPackages
    )

    await instance.ensureInstall('builder')
    expect(installedPackages).toEqual([])
  })
})
