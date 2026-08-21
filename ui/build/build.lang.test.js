import { describe, expect, test } from 'vitest'

import languages from '../lang/index.json'
import { validateStringValues } from './build.lang.js'

describe('language-pack string validation', () => {
  test('calls date.headerTitle with its documented arguments', () => {
    let receivedDate
    let receivedModel

    validateStringValues('test.js', {
      date: {
        headerTitle(date, model) {
          receivedDate = date
          receivedModel = model
          return `${model.year}-${model.month}-${model.day}`
        }
      }
    })

    expect(receivedDate).toBeInstanceOf(Date)
    expect(receivedModel).toEqual({ year: 2000, month: 1, day: 1 })
  })

  test('rejects a formatter that throws', () => {
    expect(() =>
      validateStringValues('test.js', {
        label: {
          expand(label) {
            throw new Error(label ? 'unexpected probe' : 'broken formatter')
          }
        }
      })
    ).toThrow('test.js: label.expand(0) threw: broken formatter')
  })

  test('rejects a formatter that returns a non-string', () => {
    expect(() =>
      validateStringValues('test.js', {
        table: {
          selectedRecords: rows => rows
        }
      })
    ).toThrow('test.js: table.selectedRecords(0) must return a string')
  })
})

describe('built-in language packs', () => {
  test('advertises valid BCP 47 language tags', () => {
    for (const { isoName } of languages) {
      expect(() => new Intl.Locale(isoName), isoName).not.toThrow()
    }
  })

  test.each([
    ['kur-CKB', 'ckb'],
    ['mm', 'my'],
    ['sr-CYR', 'sr-Cyrl']
  ])(
    'keeps the deprecated %s import as an alias for %s',
    async (legacy, canonical) => {
      const legacyPack = await import(`../lang/${legacy}.js`).then(
        module => module.default
      )
      const canonicalPack = await import(`../lang/${canonical}.js`).then(
        module => module.default
      )

      expect(legacyPack).toBe(canonicalPack)
      expect(legacyPack.isoName).toBe(canonical)
    }
  )

  test.each([
    ['gn', 'pagination.prev', 'pagination.next'],
    ['ug', 'label.expand', 'label.collapse']
  ])(
    '%s gives opposite actions distinct labels',
    async (isoName, firstPath, secondPath) => {
      const pack = await import(`../lang/${isoName}.js`).then(
        module => module.default
      )
      const read = path =>
        path.split('.').reduce((value, key) => value[key], pack)
      const resolve = value => (typeof value === 'function' ? value() : value)

      expect(resolve(read(firstPath))).not.toBe(resolve(read(secondPath)))
    }
  )
})
