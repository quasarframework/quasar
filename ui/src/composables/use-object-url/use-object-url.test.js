import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, ref } from 'vue'

import useObjectUrl from './use-object-url.js'

enableAutoUnmount(afterEach)

let revokeSpy

beforeEach(() => {
  revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
})

afterEach(() => {
  vi.restoreAllMocks()
})

function createBlob(content) {
  return new Blob([content], { type: 'text/plain' })
}

function mountObjectUrl(source) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useObjectUrl(source)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

async function readUrl(url) {
  const response = await fetch(url)
  return response.text()
}

describe('[useObjectUrl API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { objectUrl, revokeObjectUrl } = mountObjectUrl()

        expect(isRef(objectUrl)).toBe(true)
        expect(objectUrl.value).toBeNull()
        expect(revokeObjectUrl).toBeTypeOf('function')
      })

      test('creates an object URL for a plain source', async () => {
        const { objectUrl } = mountObjectUrl(createBlob('hello'))

        expect(objectUrl.value).toMatch(/^blob:/)
        await expect(readUrl(objectUrl.value)).resolves.toBe('hello')
        expect(revokeSpy).not.toHaveBeenCalled()
      })

      test('accepts a File', () => {
        const file = new File(['x'], 'x.txt', { type: 'text/plain' })
        const { objectUrl } = mountObjectUrl(file)

        expect(objectUrl.value).toMatch(/^blob:/)
      })

      test('follows a reactive source and revokes the previous URL', async () => {
        const source = ref(createBlob('first'))
        const { objectUrl } = mountObjectUrl(source)
        const first = objectUrl.value

        await expect(readUrl(first)).resolves.toBe('first')

        source.value = createBlob('second')

        expect(objectUrl.value).toMatch(/^blob:/)
        expect(objectUrl.value).not.toBe(first)
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        await expect(readUrl(objectUrl.value)).resolves.toBe('second')
      })

      test('revokes and yields null when the source becomes nullish', () => {
        const source = ref(createBlob('a'))
        const { objectUrl } = mountObjectUrl(source)
        const first = objectUrl.value

        source.value = null
        expect(objectUrl.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)

        source.value = void 0
        expect(objectUrl.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledOnce()

        source.value = createBlob('b')
        expect(objectUrl.value).toMatch(/^blob:/)
        expect(objectUrl.value).not.toBe(first)
      })

      test('keeps the URL when a getter re-runs with the same object', () => {
        const blob = createBlob('same')
        const unrelated = ref(0)
        const { objectUrl } = mountObjectUrl(() =>
          unrelated.value >= 0 ? blob : null
        )
        const first = objectUrl.value

        unrelated.value++

        expect(objectUrl.value).toBe(first)
        expect(revokeSpy).not.toHaveBeenCalled()
      })

      test('revokes the URL when the component gets destroyed', () => {
        const { wrapper, objectUrl } = mountObjectUrl(createBlob('bye'))
        const first = objectUrl.value

        wrapper.unmount()

        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        expect(objectUrl.value).toBeNull()
      })

      test('revokeObjectUrl() revokes the URL and ends the tracking', () => {
        const source = ref(createBlob('a'))
        const { objectUrl, revokeObjectUrl } = mountObjectUrl(source)
        const first = objectUrl.value

        revokeObjectUrl()

        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        expect(objectUrl.value).toBeNull()

        source.value = createBlob('b')
        expect(objectUrl.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledOnce()
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const source = ref(createBlob('a'))
        const { objectUrl, revokeObjectUrl } = useObjectUrl(source)
        const first = objectUrl.value

        expect(first).toMatch(/^blob:/)

        source.value = createBlob('b')
        expect(objectUrl.value).not.toBe(first)
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)

        revokeObjectUrl()
        expect(objectUrl.value).toBeNull()
        expect(warn).not.toHaveBeenCalled()
      })
    })
  })
})
