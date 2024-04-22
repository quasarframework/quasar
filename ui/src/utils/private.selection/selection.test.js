import { describe, test, expect, onTestFinished } from 'vitest'

import { clearSelection } from './selection.js'

describe('[selection API]', () => {
  describe('[Functions]', () => {
    describe('[(function)clearSelection]', () => {
      test('has correct return value', () => {
        expect(
          clearSelection()
        ).toBeUndefined()
      })

      test('works correctly', () => {
        const selection = window.getSelection()

        const el = document.createElement('div')
        el.innerHTML = '<address>quasar@email.com</address>'

        document.body.appendChild(el)

        onTestFinished(() => { el.remove() })

        selection.selectAllChildren(el)

        expect(
          selection.toString()
        ).toBe('quasar@email.com')

        expect(
          clearSelection()
        ).toBeUndefined()

        expect(
          selection.toString()
        ).toBe('')
      })
    })
  })
})
