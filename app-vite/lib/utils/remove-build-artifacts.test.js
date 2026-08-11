import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  getBuildArtifactsCleanTarget,
  removeBuildArtifacts
} from './remove-build-artifacts.js'
import { log } from './logger.js'

vi.mock('./logger.js', () => ({
  log: vi.fn()
}))

const tempDirs = []

// realpathSync() so the fixture paths already are "effective" paths
// (on macOS the tmp dir lives behind the /var -> /private/var symlink)
function makeDir(prefix) {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  vi.clearAllMocks()

  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('[remove-build-artifacts.js]', () => {
  describe('getBuildArtifactsCleanTarget()', () => {
    test('rejects an empty or non-string targetDir', () => {
      const projectDir = makeDir('q-rm-project-')

      for (const targetDir of ['', '   ', void 0, null, 42]) {
        expect(() =>
          getBuildArtifactsCleanTarget({ targetDir, projectDir })
        ).toThrow('Build output directory must be a non-empty path')
      }
    })

    test('rejects an empty or non-string projectDir', () => {
      for (const projectDir of ['', '   ', void 0, null, 42]) {
        expect(() =>
          getBuildArtifactsCleanTarget({ targetDir: 'dist', projectDir })
        ).toThrow('Project directory must be a non-empty path')
      }
    })

    test('resolves a relative target inside the project', () => {
      const projectDir = makeDir('q-rm-project-')

      // "dist" does not exist yet; the existing ancestor is the project dir
      expect(
        getBuildArtifactsCleanTarget({ targetDir: 'dist', projectDir })
      ).toEqual({
        target: join(projectDir, 'dist'),
        effectiveTarget: join(projectDir, 'dist')
      })
    })

    test('resolves a deeply non-existent target through its ancestors', () => {
      const projectDir = makeDir('q-rm-project-')

      expect(
        getBuildArtifactsCleanTarget({ targetDir: 'dist/spa/js', projectDir })
      ).toEqual({
        target: join(projectDir, 'dist', 'spa', 'js'),
        effectiveTarget: join(projectDir, 'dist', 'spa', 'js')
      })
    })

    test('refuses a filesystem root as target', () => {
      const projectDir = makeDir('q-rm-project-')

      expect(() =>
        getBuildArtifactsCleanTarget({
          targetDir: '/',
          projectDir,
          allowOutsideProject: true
        })
      ).toThrow('Refusing to remove a filesystem root as build output')
    })

    test('refuses the user home directory as target', () => {
      const projectDir = makeDir('q-rm-project-')

      expect(() =>
        getBuildArtifactsCleanTarget({
          targetDir: homedir(),
          projectDir,
          allowOutsideProject: true
        })
      ).toThrow('Refusing to remove the user home directory as build output')
    })

    test('refuses the project root as target', () => {
      const projectDir = makeDir('q-rm-project-')

      for (const targetDir of ['.', projectDir]) {
        expect(() =>
          getBuildArtifactsCleanTarget({ targetDir, projectDir })
        ).toThrow('Refusing to remove the project root as build output')
      }
    })

    test('refuses a target outside the project by default', () => {
      const projectDir = makeDir('q-rm-project-')
      const outsideDir = makeDir('q-rm-outside-')

      for (const targetDir of ['../q-escape', outsideDir]) {
        expect(() =>
          getBuildArtifactsCleanTarget({ targetDir, projectDir })
        ).toThrow('Build output directory must remain inside the project')
      }
    })

    test('requires allowOutsideProject to be exactly true', () => {
      const projectDir = makeDir('q-rm-project-')
      const outsideDir = makeDir('q-rm-outside-')

      // truthy but not the boolean true is not enough
      expect(() =>
        getBuildArtifactsCleanTarget({
          targetDir: outsideDir,
          projectDir,
          allowOutsideProject: 1
        })
      ).toThrow('Build output directory must remain inside the project')

      expect(
        getBuildArtifactsCleanTarget({
          targetDir: outsideDir,
          projectDir,
          allowOutsideProject: true
        })
      ).toEqual({
        target: outsideDir,
        effectiveTarget: outsideDir
      })
    })

    test('detects a symlink escaping the project', () => {
      const projectDir = makeDir('q-rm-project-')
      const outsideDir = makeDir('q-rm-outside-')

      symlinkSync(outsideDir, join(projectDir, 'dist'))

      expect(() =>
        getBuildArtifactsCleanTarget({ targetDir: 'dist', projectDir })
      ).toThrow('Build output directory must remain inside the project')

      expect(
        getBuildArtifactsCleanTarget({
          targetDir: 'dist',
          projectDir,
          allowOutsideProject: true
        })
      ).toEqual({
        target: join(projectDir, 'dist'),
        effectiveTarget: outsideDir
      })
    })
  })

  describe('removeBuildArtifacts()', () => {
    test('removes the target dir with its contents, keeping siblings', () => {
      const projectDir = makeDir('q-rm-project-')
      const distDir = join(projectDir, 'dist')

      mkdirSync(join(distDir, 'assets'), { recursive: true })
      writeFileSync(join(distDir, 'index.html'), '<html></html>\n')
      writeFileSync(join(distDir, 'assets', 'app.js'), '// js\n')
      writeFileSync(join(projectDir, 'keep.txt'), 'keep me\n')

      removeBuildArtifacts({ targetDir: 'dist', projectDir })

      expect(existsSync(distDir)).toBe(false)
      expect(existsSync(join(projectDir, 'keep.txt'))).toBe(true)
      expect(log).toHaveBeenCalledTimes(1)
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining(`Removing build artifacts: ${distDir}`)
      )
    })

    test('is a no-op when the target does not exist', () => {
      const projectDir = makeDir('q-rm-project-')

      expect(() =>
        removeBuildArtifacts({ targetDir: 'dist', projectDir })
      ).not.toThrow()

      expect(log).not.toHaveBeenCalled()
    })

    test('still refuses an unsafe target before touching the disk', () => {
      const projectDir = makeDir('q-rm-project-')
      const outsideDir = makeDir('q-rm-outside-')
      writeFileSync(join(outsideDir, 'file.txt'), 'data\n')

      expect(() =>
        removeBuildArtifacts({ targetDir: outsideDir, projectDir })
      ).toThrow('Build output directory must remain inside the project')

      expect(existsSync(join(outsideDir, 'file.txt'))).toBe(true)
      expect(log).not.toHaveBeenCalled()
    })

    test('empties the resolved dir but keeps the symlink itself', () => {
      const projectDir = makeDir('q-rm-project-')
      const outsideDir = makeDir('q-rm-outside-')
      const linkPath = join(projectDir, 'dist')

      writeFileSync(join(outsideDir, 'stale.js'), '')
      symlinkSync(outsideDir, linkPath)

      removeBuildArtifacts({
        targetDir: 'dist',
        projectDir,
        allowOutsideProject: true
      })

      // the stale artifacts are gone, but the link survives so that
      // future builds keep writing through it
      expect(existsSync(join(outsideDir, 'stale.js'))).toBe(false)
      expect(existsSync(outsideDir)).toBe(true)
      expect(lstatSync(linkPath).isSymbolicLink()).toBe(true)

      expect(log).toHaveBeenCalledWith(
        expect.stringContaining(`(resolves to: ${outsideDir})`)
      )
    })
  })
})
