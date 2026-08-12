import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import utils from '../../lib/utils.js'

describe('[utils.js]', () => {
  describe('definitions', () => {
    test('exposes non-empty string defaults', () => {
      for (const key of ['projectFolder', 'product', 'template']) {
        expect(utils.definitions[key].default).toBeTypeOf('string')
        expect(utils.definitions[key].default.length).not.toBe(0)
      }
    })

    test('the default template points to an existing template script', () => {
      expect(
        existsSync(
          join(
            import.meta.dirname,
            '../../templates',
            utils.definitions.template.default,
            'create-quasar-script.js'
          )
        )
      ).toBe(true)
    })

    test('the default project folder derives a valid package name', () => {
      const name = utils.definitions.name.default(
        utils.definitions.projectFolder.default
      )
      expect(utils.definitions.name.isValid(name)).toBe(true)
    })

    describe('name.default()', () => {
      test('keeps an already valid folder name', () => {
        expect(utils.definitions.name.default('my-app')).toBe('my-app')
      })

      test('lowercases and replaces whitespace with dashes', () => {
        expect(utils.definitions.name.default('My Quasar App')).toBe(
          'my-quasar-app'
        )
      })

      test('strips a leading dot or underscore', () => {
        expect(utils.definitions.name.default('.hidden')).toBe('hidden')
        expect(utils.definitions.name.default('_private')).toBe('private')
      })

      test('replaces invalid characters with dashes', () => {
        expect(utils.definitions.name.default('my!app?v2')).toBe('my-app-v2')
      })

      test('trims surrounding whitespace', () => {
        expect(utils.definitions.name.default('  my-app  ')).toBe('my-app')
      })
    })

    describe('name.isValid()', () => {
      test('accepts valid npm package names', () => {
        expect(utils.definitions.name.isValid('my-app')).toBe(true)
        expect(utils.definitions.name.isValid('my-app.v2~x')).toBe(true)
        expect(utils.definitions.name.isValid('@scope/my-app')).toBe(true)
      })

      test('rejects empty and reserved names', () => {
        expect(utils.definitions.name.isValid('')).toBeFalsy()
        expect(utils.definitions.name.isValid('node_modules')).toBe(false)
      })

      test('rejects uppercase, spaces and leading dots', () => {
        expect(utils.definitions.name.isValid('MyApp')).toBe(false)
        expect(utils.definitions.name.isValid('my app')).toBe(false)
        expect(utils.definitions.name.isValid('.my-app')).toBe(false)
      })

      test('rejects names longer than 214 characters', () => {
        expect(utils.definitions.name.isValid('a'.repeat(214))).toBe(true)
        expect(utils.definitions.name.isValid('a'.repeat(215))).toBe(false)
      })
    })
  })

  describe('convertArrayToObject()', () => {
    test('maps entries to true flags', () => {
      expect(utils.convertArrayToObject(['sass', 'linting'])).toEqual({
        sass: true,
        linting: true
      })
    })

    test('returns an empty object for an empty array', () => {
      expect(utils.convertArrayToObject([])).toEqual({})
    })
  })

  describe('exitOnCancel()', () => {
    test('passes through regular values', () => {
      expect(utils.exitOnCancel('value')).toBe('value')
      expect(utils.exitOnCancel(false)).toBe(false)
    })
  })

  describe('cancelScaffolding()', () => {
    afterAll(() => {
      vi.restoreAllMocks()
    })

    test('prints the message and exits with the object form', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true)
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      expect(() =>
        utils.cancelScaffolding({ message: 'custom cancel message' })
      ).toThrow('process.exit called')
      expect(exitSpy).toHaveBeenCalledExactlyOnceWith(1)

      const output = writeSpy.mock.calls.map(call => call[0]).join('')
      expect(output).toContain('custom cancel message')
    })

    test('rejects anything but the object form', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })
      exitSpy.mockClear()

      for (const param of ['a plain string message', 42, true]) {
        expect(() => utils.cancelScaffolding(param)).toThrow(TypeError)
      }
      expect(exitSpy).not.toHaveBeenCalled()
    })

    test('does not exit when the exit option is false', () => {
      vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })
      exitSpy.mockClear()

      expect(() =>
        utils.cancelScaffolding({ message: 'no exit', exit: false })
      ).not.toThrow()
      expect(exitSpy).not.toHaveBeenCalled()
    })
  })

  describe('promptUser()', () => {
    test('skips questions for pre-filled keys', async () => {
      const scope = { name: 'pre-filled' }
      let asked = false

      await utils.promptUser(scope, {
        name: () => {
          asked = true
          return 'from-prompt'
        }
      })

      expect(asked).toBe(false)
      expect(scope.name).toBe('pre-filled')
    })

    test('fills missing keys from the question functions', async () => {
      const scope = { name: 'pre-filled' }

      await utils.promptUser(scope, {
        name: () => 'ignored',
        product: () => Promise.resolve('My Product')
      })

      expect(scope).toEqual({ name: 'pre-filled', product: 'My Product' })
    })

    test('treats false and empty string as pre-filled values', async () => {
      const scope = { install: false, author: '' }
      const asked = []

      await utils.promptUser(scope, {
        install: () => {
          asked.push('install')
          return 'pnpm'
        },
        author: () => {
          asked.push('author')
          return 'Someone'
        }
      })

      expect(asked).toEqual([])
      expect(scope).toEqual({ install: false, author: '' })
    })
  })

  describe('createTargetDir()', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'create-quasar-target-'))

    afterAll(() => {
      rmSync(rootDir, { recursive: true, force: true })
    })

    test('creates a missing project folder', () => {
      const projectFolder = join(rootDir, 'fresh')

      utils.createTargetDir({ projectFolder, overwrite: false })

      expect(existsSync(projectFolder)).toBe(true)
    })

    test('overwrite empties the folder but keeps .git', () => {
      const projectFolder = join(rootDir, 'overwrite')
      mkdirSync(join(projectFolder, '.git'), { recursive: true })
      writeFileSync(join(projectFolder, '.git', 'HEAD'), 'ref: main')
      mkdirSync(join(projectFolder, 'src'))
      writeFileSync(join(projectFolder, 'src', 'index.js'), '')
      writeFileSync(join(projectFolder, 'README.md'), '')

      utils.createTargetDir({ projectFolder, overwrite: true })

      expect(existsSync(join(projectFolder, '.git', 'HEAD'))).toBe(true)
      expect(existsSync(join(projectFolder, 'src'))).toBe(false)
      expect(existsSync(join(projectFolder, 'README.md'))).toBe(false)
    })
  })

  describe('initializeGit()', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'create-quasar-git-'))

    beforeAll(() => {
      // deterministic git behavior: no user/system config
      // (so no GPG signing or hooks) and a fixed commit identity
      vi.stubEnv('GIT_CONFIG_GLOBAL', '/dev/null')
      vi.stubEnv('GIT_CONFIG_SYSTEM', '/dev/null')
      vi.stubEnv('GIT_AUTHOR_NAME', 'Test')
      vi.stubEnv('GIT_AUTHOR_EMAIL', 'test@example.com')
      vi.stubEnv('GIT_COMMITTER_NAME', 'Test')
      vi.stubEnv('GIT_COMMITTER_EMAIL', 'test@example.com')
    })

    afterAll(() => {
      vi.unstubAllEnvs()
      rmSync(rootDir, { recursive: true, force: true })
    })

    test('initializes a repository with an initial commit', () => {
      const projectFolder = join(rootDir, 'fresh')
      mkdirSync(projectFolder, { recursive: true })
      // a freshly scaffolded folder always has files to commit
      writeFileSync(join(projectFolder, 'package.json'), '{}')

      utils.initializeGit(projectFolder)

      expect(existsSync(join(projectFolder, '.git'))).toBe(true)

      const log = execSync('git log --format=%s', {
        cwd: projectFolder
      }).toString()
      expect(log).toContain('Initialize the project')

      // no user branch-name preference in this env -> pinned to "main"
      const branch = execSync('git branch --show-current', {
        cwd: projectFolder
      })
        .toString()
        .trim()
      expect(branch).toBe('main')
    })

    test('respects a user-configured default branch name', () => {
      const projectFolder = join(rootDir, 'configured-branch')
      mkdirSync(projectFolder, { recursive: true })
      writeFileSync(join(projectFolder, 'package.json'), '{}')

      const gitConfig = join(rootDir, 'gitconfig')
      writeFileSync(gitConfig, '[init]\n\tdefaultBranch = trunk\n')
      vi.stubEnv('GIT_CONFIG_GLOBAL', gitConfig)

      try {
        utils.initializeGit(projectFolder)
      } finally {
        vi.stubEnv('GIT_CONFIG_GLOBAL', '/dev/null')
      }

      const branch = execSync('git branch --show-current', {
        cwd: projectFolder
      })
        .toString()
        .trim()
      expect(branch).toBe('trunk')
    })

    test('skips when a parent folder is already a git repository', () => {
      const parentRepo = join(rootDir, 'parent-repo')
      const projectFolder = join(parentRepo, 'nested-project')
      mkdirSync(projectFolder, { recursive: true })
      execSync('git init', { cwd: parentRepo })

      utils.initializeGit(projectFolder)

      expect(existsSync(join(projectFolder, '.git'))).toBe(false)
    })
  })
})
