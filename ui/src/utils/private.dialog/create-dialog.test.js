import { createApp, defineComponent, h, nextTick } from 'vue'
import { describe, expect, test, vi } from 'vitest'

import { createDialog, merge } from './create-dialog.js'

const defineLeaf = (showSpy, hideSpy) =>
  defineComponent({
    name: 'DialogLeaf',
    emits: ['hide'],
    methods: {
      show: showSpy,
      hide() {
        hideSpy()
        this.$emit('hide')
      }
    },
    render() {
      return h('div', { class: 'dialog-leaf' })
    }
  })

const defineWrapper = (name, Child, options) =>
  defineComponent({
    name,
    ...options,
    render() {
      return h(Child)
    }
  })

const createCustomDialog = component =>
  createDialog({}, true, createApp({ render: () => null }))({ component })

describe('[createDialog API]', () => {
  describe('[Functions]', () => {
    describe('[(function)merge]', () => {
      test('replaces an array-valued prop instead of spreading it into an object', () => {
        const target = { options: { items: ['a', 'b', 'c'] } }

        merge(target, { options: { items: ['x'] } })

        expect(Array.isArray(target.options.items)).toBe(true)
        expect(target.options.items).toEqual(['x'])
      })
    })

    describe('[(function)createDialog]', () => {
      test('returns a dialog factory', () => {
        const result = createDialog({}, false, {})

        expect(result).toBeTypeOf('function')
      })

      test('resolves show/hide through deeply nested wrapper components', async () => {
        const showSpy = vi.fn()
        const hideSpy = vi.fn()

        const api = createCustomDialog(
          defineWrapper(
            'DialogRoot',
            defineWrapper('DialogMiddle', defineLeaf(showSpy, hideSpy))
          )
        )

        await nextTick()
        expect(showSpy).toHaveBeenCalledTimes(1)
        expect(document.querySelector('.dialog-leaf')).not.toBe(null)

        api.hide()
        expect(hideSpy).toHaveBeenCalledTimes(1)
        expect(document.querySelector('.dialog-leaf')).toBe(null)
      })

      test('skips wrappers holding a non-function show/hide while resolving', async () => {
        const showSpy = vi.fn()
        const hideSpy = vi.fn()

        const api = createCustomDialog(
          defineWrapper(
            'DialogRoot',
            defineWrapper('DialogDecoy', defineLeaf(showSpy, hideSpy), {
              data: () => ({ show: true, hide: true })
            })
          )
        )

        await nextTick()
        expect(showSpy).toHaveBeenCalledTimes(1)

        api.hide()
        expect(hideSpy).toHaveBeenCalledTimes(1)
        expect(document.querySelector('.dialog-leaf')).toBe(null)
      })
    })
  })
})
