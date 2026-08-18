import { afterEach, describe, expect, test, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref } from 'vue'

import useMask, { useMaskProps } from './use-mask.js'

const scopes = []
const inputs = []

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
  inputs.splice(0).forEach(input => input.remove())
  vi.restoreAllMocks()
})

/**
 * useMask() only needs a reactive props bag, the two emitters and a ref to the
 * native control, so there is no component to mount here.
 */
function createMask(props = {}) {
  const input = document.createElement('input')
  document.body.append(input)
  inputs.push(input)

  const emit = vi.fn()
  const emitValue = vi.fn()
  const maskProps = reactive({
    modelValue: '',
    type: 'text',
    autogrow: false,
    mask: void 0,
    fillMask: false,
    reverseFillMask: false,
    unmaskedValue: false,
    maskTokens: void 0,
    ...props
  })

  const scope = effectScope()
  scopes.push(scope)

  const mask = scope.run(() => useMask(maskProps, emit, emitValue, ref(input)))

  input.value = mask.innerValue.value ?? ''

  return { mask, props: maskProps, emit, emitValue, input }
}

function keydownEvent(props) {
  return {
    keyCode: 0,
    shiftKey: false,
    altKey: false,
    preventDefault: vi.fn(),
    ...props
  }
}

describe('[useMask API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useMaskProps]', () => {
      test('is defined correctly', () => {
        expect(useMaskProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { mask } = createMask()

        expect(mask).toStrictEqual({
          innerValue: expect.$ref(''),
          hasMask: expect.$ref(false),
          moveCursorForPaste: expect.any(Function),
          updateMaskValue: expect.any(Function),
          onMaskedKeydown: expect.any(Function),
          onMaskedClick: expect.any(Function)
        })
      })

      test.each([
        ['text', { type: 'text' }, true],
        ['textarea', { type: 'textarea' }, true],
        ['search', { type: 'search' }, true],
        ['url', { type: 'url' }, true],
        ['tel', { type: 'tel' }, true],
        ['password', { type: 'password' }, true],
        ['number', { type: 'number' }, false],
        ['an autogrowing field', { type: 'number', autogrow: true }, true]
      ])('masks a %s field: %s', (_, props, expected) => {
        const { mask } = createMask({ mask: '###', ...props })

        expect(mask.hasMask.value).toBe(expected)
      })

      test.each([
        ['no mask', {}],
        ['an empty mask', { mask: '' }]
      ])('stays out of the way with %s', (_, props) => {
        const { mask } = createMask({ modelValue: 'abc', ...props })

        expect(mask.hasMask.value).toBe(false)
        expect(mask.innerValue.value).toBe('abc')
      })

      test('masks the initial model value', () => {
        const { mask } = createMask({ modelValue: '12345', mask: '###-##' })

        expect(mask.innerValue.value).toBe('123-45')
      })

      test.each([
        ['digits', '###', '12a3', '123'],
        ['letters', 'SSS', 'ab1c', 'abc'],
        ['alphanumerics', 'NNN', 'a1-b', 'a1b'],
        ['letters, uppercased', 'AAA', 'a1bc', 'ABC'],
        ['letters, lowercased', 'aaa', 'A1BC', 'abc'],
        ['alphanumerics, uppercased', 'XXX', 'a1-c', 'A1C'],
        ['alphanumerics, lowercased', 'xxx', 'A1-C', 'a1c']
      ])('keeps only the %s', (_, maskDef, modelValue, expected) => {
        const { mask } = createMask({ modelValue, mask: maskDef })

        expect(mask.innerValue.value).toBe(expected)
      })

      test.each([
        ['digits', '###', '٣٤٥'],
        ['letters', 'SSS', 'éàü'],
        ['alphanumerics', 'NNN', 'é３ü']
      ])('rejects non-ASCII %s', (_, maskDef, modelValue) => {
        const { mask } = createMask({ modelValue, mask: maskDef })

        expect(mask.innerValue.value).toBe('')
      })

      test.each([
        ['date', '2020/01/02', '20200102'],
        ['datetime', '2020/01/02 03:04', '202001020304'],
        ['time', '03:04', '0304'],
        ['fulltime', '03:04:05', '030405'],
        ['phone', '(123) 456 - 7890', '1234567890'],
        ['card', '1234 5678 9012 3456', '1234567890123456']
      ])('resolves the named %s mask', (named, expected, modelValue) => {
        const { mask } = createMask({ modelValue, mask: named })

        expect(mask.innerValue.value).toBe(expected)
      })

      test('treats an unknown token as a literal', () => {
        const { mask } = createMask({ modelValue: 'ab5', mask: 'CCC' })

        expect(mask.innerValue.value).toBe('CCC')
      })

      test('accepts custom tokens', () => {
        const { mask } = createMask({
          modelValue: 'ab5',
          mask: 'CCC',
          maskTokens: {
            C: {
              pattern: '[0-4a-eA-E]',
              negate: '[^0-4a-eA-E]',
              transform: v => v.toLocaleUpperCase()
            }
          }
        })

        // "5" does not match the custom pattern, so masking stops there
        expect(mask.innerValue.value).toBe('AB')
      })

      test('escapes a token with a backslash', () => {
        const { mask } = createMask({
          modelValue: '12',
          mask: String.raw`\###`
        })

        expect(mask.innerValue.value).toBe('#12')
      })

      test.each([
        ['nothing', false, '12'],
        ['the default char', true, '12_-__'],
        ['the supplied char', '0', '120-00']
      ])('fills the remainder with %s', (_, fillMask, expected) => {
        const { mask } = createMask({
          modelValue: '12',
          mask: '###-##',
          fillMask
        })

        expect(mask.innerValue.value).toBe(expected)
      })

      test('consumes the value from the end when reverse filling', () => {
        const { mask } = createMask({
          modelValue: '123',
          mask: '##:##',
          reverseFillMask: true
        })

        expect(mask.innerValue.value).toBe('1:23')
      })

      test('re-masks when the mask changes', async () => {
        const { mask, props } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        props.mask = '##/###'
        await nextTick()

        expect(mask.innerValue.value).toBe('12/345')
      })

      test('gives the unmasked value back when the mask goes away', async () => {
        const { mask, props, emit } = createMask({
          modelValue: '12:34',
          mask: '##:##'
        })

        props.mask = void 0
        await nextTick()

        expect(mask.hasMask.value).toBe(false)
        expect(emit).toHaveBeenCalledExactlyOnceWith(
          'update:modelValue',
          '1234'
        )
      })

      test('stays quiet when the model already holds the unmasked value', async () => {
        const { props, emit } = createMask({
          modelValue: '1234',
          mask: '##:##'
        })

        props.mask = void 0
        await nextTick()

        expect(emit).not.toHaveBeenCalled()
      })

      test.each([
        ['the fill mask', { fillMask: true }, '12_-__'],
        ['the reverse fill mask', { reverseFillMask: true }, '12']
      ])('reacts to a change of %s', async (_, changes, expected) => {
        const { mask, props } = createMask({
          modelValue: '12',
          mask: '###-##'
        })

        Object.assign(props, changes)
        await nextTick()

        expect(mask.innerValue.value).toBe(expected)
      })

      test('reacts to a change of the custom tokens', async () => {
        const { mask, props } = createMask({
          modelValue: 'ab5',
          mask: 'CCC',
          maskTokens: { C: { pattern: '[a-z0-9]', negate: '[^a-z0-9]' } }
        })

        expect(mask.innerValue.value).toBe('ab5')

        props.maskTokens.C.pattern = '[a-z]'
        props.maskTokens.C.negate = '[^a-z]'
        await nextTick()

        expect(mask.innerValue.value).toBe('ab')
      })

      test('reacts to a change of the field type', async () => {
        const { mask, props } = createMask({
          modelValue: '123',
          mask: '###'
        })

        expect(mask.hasMask.value).toBe(true)

        props.type = 'number'
        await nextTick()

        expect(mask.hasMask.value).toBe(false)
      })

      test('masks what gets typed in and reports it upwards', () => {
        const { mask, input, emitValue } = createMask({
          modelValue: '',
          mask: '###-##'
        })

        mask.updateMaskValue('12345')

        expect(mask.innerValue.value).toBe('123-45')
        expect(input.value).toBe('123-45')
        expect(emitValue).toHaveBeenCalledExactlyOnceWith('123-45', true)
      })

      test('keeps a typed char that matches an upcoming mask literal (#8354)', () => {
        const { mask } = createMask({
          modelValue: '',
          mask: '+1 123 ### ## ##'
        })

        // the digit literals of the prefix must not swallow the typed "1"
        mask.updateMaskValue('1')
        expect(mask.innerValue.value).toBe('+1 123 1')

        mask.updateMaskValue('+1 123 1234567')
        expect(mask.innerValue.value).toBe('+1 123 123 45 67')
      })

      test('reports the unmasked value when asked to', () => {
        const { mask, input, emitValue } = createMask({
          modelValue: '',
          mask: '###-##',
          unmaskedValue: true
        })

        mask.updateMaskValue('12345')

        expect(input.value).toBe('123-45')
        expect(emitValue).toHaveBeenCalledExactlyOnceWith('12345', true)
      })

      test('stays quiet when the value did not really change', () => {
        const { mask, emitValue } = createMask({
          modelValue: '123-45',
          mask: '###-##'
        })

        mask.updateMaskValue('12345')

        expect(mask.innerValue.value).toBe('123-45')
        expect(emitValue).not.toHaveBeenCalled()
      })

      test('does not report an empty value for a null model', () => {
        const { mask, emitValue } = createMask({
          modelValue: null,
          mask: '###-##'
        })

        mask.updateMaskValue('')

        expect(emitValue).not.toHaveBeenCalled()
      })

      test('rebuilds its internals when told to', () => {
        const { mask, props, emitValue } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        // the mask is swapped without going through the watcher
        props.mask = '##/###'
        mask.updateMaskValue('12345', true)

        expect(mask.innerValue.value).toBe('12/345')
        expect(emitValue).toHaveBeenLastCalledWith('12/345', true)
      })

      test('forwards the click and clears the selection anchor', () => {
        const { mask, emit } = createMask({ mask: '###-##' })
        const event = { type: 'click' }

        mask.onMaskedClick(event)

        expect(emit).toHaveBeenCalledExactlyOnceWith('click', event)
      })

      test('forwards the keydown', () => {
        const { mask, emit } = createMask({ mask: '###-##' })
        const event = keydownEvent({ keyCode: 65 })

        mask.onMaskedKeydown(event)

        expect(emit).toHaveBeenCalledExactlyOnceWith('keydown', event)
      })

      test.each([
        ['ALT is held', { keyCode: 39, altKey: true }],
        ['the key is a modifier', { keyCode: 16 }],
        ['the event was prevented', { keyCode: 39, defaultPrevented: true }]
      ])('leaves the cursor alone when %s', (_, eventProps) => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })
        const event = keydownEvent(eventProps)

        input.setSelectionRange(1, 1)
        mask.onMaskedKeydown(event)

        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(input.selectionStart).toBe(1)
      })

      test('skips over the mask literals when moving right', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        input.setSelectionRange(3, 3)
        mask.onMaskedKeydown(keydownEvent({ keyCode: 39 }))

        // it lands past the "-" separator
        expect(input.selectionStart).toBe(4)
      })

      test('skips over the mask literals when moving left', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        input.setSelectionRange(4, 4)
        mask.onMaskedKeydown(keydownEvent({ keyCode: 37 }))

        // it jumps over the "-" separator, onto the last digit slot before it
        expect(input.selectionStart).toBe(2)
      })

      test('extends the selection while SHIFT is held', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        input.setSelectionRange(1, 1)
        mask.onMaskedKeydown(keydownEvent({ keyCode: 39, shiftKey: true }))

        expect(input.selectionStart).toBe(1)
        expect(input.selectionEnd).toBe(2)
      })

      test('selects up to the character a backspace is about to remove', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        input.setSelectionRange(4, 4)
        mask.onMaskedKeydown(keydownEvent({ keyCode: 8 }))

        // the selection reaches over the separator, so a real character goes
        expect(input.selectionStart).toBe(2)
        expect(input.selectionEnd).toBe(4)
      })

      test('selects the character a delete is about to remove when reversed', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##',
          reverseFillMask: true
        })

        input.setSelectionRange(1, 1)
        mask.onMaskedKeydown(keydownEvent({ keyCode: 46 }))

        expect(input.selectionStart).toBe(1)
        expect(input.selectionEnd).toBeGreaterThan(1)
      })

      test('anchors a paste on the first free slot', () => {
        const { mask, input } = createMask({
          modelValue: '12345',
          mask: '###-##'
        })

        mask.moveCursorForPaste(input, 0, 6)

        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe(6)

        mask.moveCursorForPaste(input, 10, 10)

        // it never goes past what has been masked so far
        expect(input.selectionStart).toBe(6)
      })
    })
  })
})
