import { describe, expect, test } from 'vitest'

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
