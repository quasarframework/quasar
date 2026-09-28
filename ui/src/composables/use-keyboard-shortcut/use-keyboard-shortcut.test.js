import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import useKeyboardShortcut from './use-keyboard-shortcut.js'
import { client } from '../../plugins/platform/Platform.js'

enableAutoUnmount(afterEach)

// "Mod" resolves once per platform (module level), so the tests follow
// the platform they run on instead of flipping it
const modKey = client.is.mac === true ? 'metaKey' : 'ctrlKey'
const otherKey = client.is.mac === true ? 'ctrlKey' : 'metaKey'

// mounts a component with an input and a contenteditable div as children
function mountShortcut(shortcut, handler, options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useKeyboardShortcut(shortcut, handler, options)
        return () =>
          h('div', [
            h('input', { type: 'text' }),
            h('input', { type: 'checkbox' }),
            h('div', { contenteditable: 'true' }, 'editable'),
            h('button', 'plain')
          ])
      }
    })
  )

  const [input, checkbox, editable, button] = wrapper.element.children

  return { wrapper, input, checkbox, editable, button, ...result }
}

function press(key, init = {}, target = document.body, type = 'keydown') {
  const evt = new KeyboardEvent(type, {
    key,
    bubbles: true,
    cancelable: true,
    ...init
  })

  target.dispatchEvent(evt)

  return evt
}

describe('[useKeyboardShortcut API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const result = mountShortcut('Escape', () => {})

        expect(result.stopKeyboardShortcut).toBeTypeOf('function')
        expect(Object.keys(result)).toContain('stopKeyboardShortcut')
      })

      test('calls the handler with the event and the matched shortcut', () => {
        const handler = vi.fn()
        mountShortcut('Escape', handler)

        const evt = press('Escape')

        expect(handler).toHaveBeenCalledExactlyOnceWith(evt, 'Escape')
      })

      test('matches the key case-insensitively', () => {
        const handler = vi.fn()
        mountShortcut('escape', handler)

        press('Escape')

        expect(handler).toHaveBeenCalledOnce()
      })

      test('requires the exact set of modifiers for a letter', () => {
        const handler = vi.fn()
        mountShortcut('Ctrl+K', handler)

        press('k')
        press('K', { ctrlKey: true, shiftKey: true })
        press('k', { ctrlKey: true, altKey: true })
        press('k', { metaKey: true })
        expect(handler).not.toHaveBeenCalled()

        press('k', { ctrlKey: true })
        expect(handler).toHaveBeenCalledOnce()
      })

      test('accepts the modifier aliases', () => {
        const handler = vi.fn()
        mountShortcut(
          ['Control+Option+A', 'Cmd+B', 'Command+C', 'Win+D', 'Super+E'],
          handler
        )

        press('a', { ctrlKey: true, altKey: true })
        press('b', { metaKey: true })
        press('c', { metaKey: true })
        press('d', { metaKey: true })
        press('e', { metaKey: true })

        expect(handler).toHaveBeenCalledTimes(5)
      })

      test('"Mod" is Meta on macOS and Ctrl elsewhere', () => {
        const handler = vi.fn()
        mountShortcut('Mod+S', handler)

        press('s', { [otherKey]: true })
        expect(handler).not.toHaveBeenCalled()

        press('s', { [modKey]: true })
        expect(handler).toHaveBeenCalledOnce()
      })

      test('matches on the physical "code" as well', () => {
        const handler = vi.fn()
        mountShortcut('Alt+KeyK', handler)

        // macOS produces a symbol for Alt+letter
        press('˚', { altKey: true, code: 'KeyK' })

        expect(handler).toHaveBeenCalledOnce()
      })

      test('ignores Shift for a punctuation or digit key', () => {
        const handler = vi.fn()
        mountShortcut(['?', '1', '-', 'Minus'], handler)

        // "?" takes Shift on a US layout
        press('?', { shiftKey: true })
        // "1" takes Shift on a French layout
        press('1', { shiftKey: true })
        press('1')
        // the produced character still has to match: Shift with the
        // minus key is "_" on a US layout, only the "code" form gets it
        press('_', { shiftKey: true, code: 'Minus' })
        press('-', { code: 'Minus' })

        expect(handler.mock.calls.map(call => call[1])).toStrictEqual([
          '?',
          '1',
          '1',
          'Minus',
          '-'
        ])
      })

      test('keeps Shift significant when the shortcut asks for it', () => {
        const handler = vi.fn()
        mountShortcut('Shift+ArrowUp', handler)

        press('ArrowUp')
        expect(handler).not.toHaveBeenCalled()

        press('ArrowUp', { shiftKey: true })
        expect(handler).toHaveBeenCalledOnce()
      })

      test('resolves the key aliases', () => {
        const handler = vi.fn()
        mountShortcut(
          ['Esc', 'Space', 'Plus', 'Return', 'Up', 'Down', 'Left', 'Right'],
          handler
        )

        press('Escape')
        press(' ')
        press('+')
        press('Enter')
        press('ArrowUp')
        press('ArrowDown')
        press('ArrowLeft')
        press('ArrowRight')

        expect(handler).toHaveBeenCalledTimes(8)
      })

      test('reads a trailing "+" as the plus key', () => {
        const handler = vi.fn()
        mountShortcut('Ctrl++', handler)

        press('+', { ctrlKey: true })

        expect(handler).toHaveBeenCalledExactlyOnceWith(
          expect.any(KeyboardEvent),
          'Ctrl++'
        )
      })

      test('accepts a modifier as the key itself', () => {
        const handler = vi.fn()
        mountShortcut('Shift', handler)

        press('Shift', { shiftKey: true })

        expect(handler).toHaveBeenCalledOnce()
      })

      test('fires once for the first matching alias', () => {
        const handler = vi.fn()
        mountShortcut(['Mod+K', 'Ctrl+K', 'Meta+K'], handler)

        press('k', { [modKey]: true })

        expect(handler).toHaveBeenCalledOnce()
      })

      test('skips shortcuts it cannot parse', () => {
        const handler = vi.fn()
        mountShortcut(['Hyper+K', '', 'Escape', 42], handler)

        press('k')
        press('Escape')

        expect(handler).toHaveBeenCalledExactlyOnceWith(
          expect.any(KeyboardEvent),
          'Escape'
        )
      })

      test('prevents the default action of a matched key only', () => {
        mountShortcut('Ctrl+S', () => {})

        const matched = press('s', { ctrlKey: true })
        const other = press('s')

        expect(matched.defaultPrevented).toBe(true)
        expect(other.defaultPrevented).toBe(false)
      })

      test('keeps the default action with "preventDefault: false"', () => {
        const handler = vi.fn()
        mountShortcut('Ctrl+S', handler, { preventDefault: false })

        const evt = press('s', { ctrlKey: true })

        expect(handler).toHaveBeenCalledOnce()
        expect(evt.defaultPrevented).toBe(false)
      })

      test('ignores the auto-repeated events of a held key', () => {
        const handler = vi.fn()
        mountShortcut('ArrowDown', handler)

        press('ArrowDown')
        press('ArrowDown', { repeat: true })
        press('ArrowDown', { repeat: true })

        expect(handler).toHaveBeenCalledOnce()
      })

      test('fires for repeated events with "repeat: true"', () => {
        const handler = vi.fn()
        mountShortcut('ArrowDown', handler, { repeat: true })

        press('ArrowDown')
        press('ArrowDown', { repeat: true })

        expect(handler).toHaveBeenCalledTimes(2)
      })

      test('skips typing shortcuts while the focus is in a text field', () => {
        const handler = vi.fn()
        const { input, editable } = mountShortcut(
          ['k', 'Digit1', 'Minus', '?', 'Escape', 'Ctrl+K', 'Shift+K'],
          handler
        )

        press('k', {}, input)
        press('1', { code: 'Digit1' }, input)
        press('_', { shiftKey: true, code: 'Minus' }, input)
        press('?', { shiftKey: true }, input)
        press('K', { shiftKey: true }, input)
        press('k', {}, editable)
        expect(handler).not.toHaveBeenCalled()

        // non-printing keys and modifier combos still work there
        press('Escape', {}, input)
        press('k', { ctrlKey: true }, input)
        press('Escape', {}, editable)
        expect(handler).toHaveBeenCalledTimes(3)
      })

      test('does not treat a checkbox as a text field', () => {
        const handler = vi.fn()
        const { checkbox, button } = mountShortcut('k', handler)

        press('k', {}, checkbox)
        press('k', {}, button)

        expect(handler).toHaveBeenCalledTimes(2)
      })

      test('lets typing shortcuts through with "ignoreInputs: false"', () => {
        const handler = vi.fn()
        const { input } = mountShortcut('k', handler, { ignoreInputs: false })

        press('k', {}, input)

        expect(handler).toHaveBeenCalledOnce()
      })

      test('ignores events fired during an IME composition', () => {
        const handler = vi.fn()
        mountShortcut('Enter', handler)

        press('Enter', { isComposing: true })

        expect(handler).not.toHaveBeenCalled()
      })

      test('ignores Quasar synthetic key events and plain Events', () => {
        const handler = vi.fn()
        mountShortcut('Enter', handler)

        const synthetic = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true
        })
        synthetic.qKeyEvent = true
        document.body.dispatchEvent(synthetic)
        document.body.dispatchEvent(new Event('keydown', { bubbles: true }))

        expect(handler).not.toHaveBeenCalled()
      })

      test('listens on keyup with the "keyup" option', () => {
        const handler = vi.fn()
        mountShortcut('Escape', handler, { keyup: true })

        press('Escape')
        expect(handler).not.toHaveBeenCalled()

        press('Escape', {}, document.body, 'keyup')
        expect(handler).toHaveBeenCalledOnce()
      })

      test('listens on the "target" option instead of window', () => {
        const handler = vi.fn()
        const target = ref(null)
        const { input, button } = mountShortcut('Escape', handler, { target })

        target.value = input
        press('Escape', {}, button)
        expect(handler).not.toHaveBeenCalled()

        press('Escape', {}, input)
        expect(handler).toHaveBeenCalledOnce()
      })

      test('listens in the capture phase with the "capture" option', () => {
        const order = []
        const { button } = mountShortcut(
          'Escape',
          () => {
            order.push('shortcut')
          },
          { capture: true }
        )
        button.addEventListener('keydown', evt => {
          order.push('button')
          evt.stopPropagation()
        })

        press('Escape', {}, button)

        expect(order).toStrictEqual(['shortcut', 'button'])
      })

      test('pauses with the "disabled" option', () => {
        const handler = vi.fn()
        const options = ref({ disabled: true })
        mountShortcut('Escape', handler, options)

        press('Escape')
        expect(handler).not.toHaveBeenCalled()

        options.value = { disabled: false }
        press('Escape')
        expect(handler).toHaveBeenCalledOnce()
      })

      test('follows a reactive shortcut', () => {
        const handler = vi.fn()
        const shortcut = ref('Ctrl+K')
        mountShortcut(shortcut, handler)

        shortcut.value = 'Ctrl+J'

        press('k', { ctrlKey: true })
        expect(handler).not.toHaveBeenCalled()

        press('j', { ctrlKey: true })
        expect(handler).toHaveBeenCalledExactlyOnceWith(
          expect.any(KeyboardEvent),
          'Ctrl+J'
        )
      })

      test('accepts the shortcut as a getter', () => {
        const handler = vi.fn()
        const key = ref('a')
        mountShortcut(() => `Ctrl+${key.value}`, handler)

        key.value = 'b'
        press('b', { ctrlKey: true })

        expect(handler).toHaveBeenCalledOnce()
      })

      test('stops listening when the component gets destroyed', () => {
        const handler = vi.fn()
        const { wrapper } = mountShortcut('Escape', handler)

        wrapper.unmount()
        press('Escape')

        expect(handler).not.toHaveBeenCalled()
      })

      test('stopKeyboardShortcut() ends the listening for good', () => {
        const handler = vi.fn()
        const options = ref({})
        const { stopKeyboardShortcut } = mountShortcut(
          'Escape',
          handler,
          options
        )

        stopKeyboardShortcut()
        press('Escape')

        options.value = { keyup: true }
        press('Escape', {}, document.body, 'keyup')

        expect(handler).not.toHaveBeenCalled()
      })

      test('works outside of a component instance', () => {
        const handler = vi.fn()
        const { stopKeyboardShortcut } = useKeyboardShortcut('Escape', handler)

        press('Escape')
        expect(handler).toHaveBeenCalledOnce()

        stopKeyboardShortcut()
        press('Escape')
        expect(handler).toHaveBeenCalledOnce()
      })
    })
  })
})
