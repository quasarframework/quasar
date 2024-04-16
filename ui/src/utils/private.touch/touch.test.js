import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { getModifierDirections, shouldStart } from './touch.js'

async function createEvent (nodeName) {
  let evt
  const wrapper = mount({ template: `<${ nodeName } />` }, {
    props: {
      onClick: localEvt => { evt = localEvt }
    }
  })

  await wrapper.trigger('click')
  return evt
}

describe('[touch API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getModifierDirections]', () => {
      test.each([
        [ 'left', { left: true } ],
        [ 'left+right', { left: true, right: true }, { left: true, right: true, horizontal: true } ],
        [ 'horizontal', { horizontal: true }, { left: true, right: true, horizontal: true } ],

        [ 'up', { up: true } ],
        [ 'up+down', { up: true, down: true }, { up: true, down: true, vertical: true } ],
        [ 'vertical', { vertical: true }, { up: true, down: true, vertical: true } ],

        [ 'right+down', { right: true, down: true } ],
        [ 'none', {},
          { up: true, down: true, left: true, right: true, horizontal: true, vertical: true, all: true }
        ],
        [ 'horizontal+vertical',
          { horizontal: true, vertical: true },
          { up: true, down: true, left: true, right: true, horizontal: true, vertical: true, all: true }
        ]
      ])('has correct return value for %s', (_, mod, expected) => {
        const result = getModifierDirections(mod)
        expect(result).toStrictEqual(expected || mod)
      })
    })

    describe('[(function)shouldStart]', () => {
      test('has handler', async () => {
        const evt = await createEvent('div')

        const result = shouldStart(evt, {
          handler: () => {}
        })
        expect(result).toBe(true)
      })

      test('no handler', async () => {
        const evt = await createEvent('div')

        const result = shouldStart(evt, {})
        expect(result).toBe(false)
      })

      test('input element', async () => {
        const evt = await createEvent('input')

        const result = shouldStart(evt, {
          handler: () => {}
        })
        expect(result).toBe(false)
      })

      test('textarea element', async () => {
        const evt = await createEvent('textarea')

        const result = shouldStart(evt, {
          handler: () => {}
        })
        expect(result).toBe(false)
      })

      test('on a Quasar cloned event (by itself)', async () => {
        const evt = await createEvent('div')
        evt.qClonedBy = 'abc'

        const result = shouldStart(evt, {
          uid: 'abc',
          handler: () => {}
        })
        expect(result).toBe(false)
      })

      test('on a Quasar cloned event (by someone else)', async () => {
        const evt = await createEvent('div')
        evt.qClonedBy = 'abc'

        const result = shouldStart(evt, {
          uid: 'xyz',
          handler: () => {}
        })
        expect(result).toBe(true)
      })
    })
  })
})
