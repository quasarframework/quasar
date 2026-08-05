import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

import utils from '../lib/utils.js'

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
            '../templates',
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
})
