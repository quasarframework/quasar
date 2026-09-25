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
        const { url, stop } = mountObjectUrl()

        expect(isRef(url)).toBe(true)
        expect(url.value).toBeNull()
        expect(stop).toBeTypeOf('function')
      })

      test('creates an object URL for a plain source', async () => {
        const { url } = mountObjectUrl(createBlob('hello'))

        expect(url.value).toMatch(/^blob:/)
        await expect(readUrl(url.value)).resolves.toBe('hello')
        expect(revokeSpy).not.toHaveBeenCalled()
      })

      test('accepts a File', () => {
        const file = new File(['x'], 'x.txt', { type: 'text/plain' })
        const { url } = mountObjectUrl(file)

        expect(url.value).toMatch(/^blob:/)
      })

      test('follows a reactive source and revokes the previous URL', async () => {
        const source = ref(createBlob('first'))
        const { url } = mountObjectUrl(source)
        const first = url.value

        await expect(readUrl(first)).resolves.toBe('first')

        source.value = createBlob('second')

        expect(url.value).toMatch(/^blob:/)
        expect(url.value).not.toBe(first)
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        await expect(readUrl(url.value)).resolves.toBe('second')
      })

      test('revokes and yields null when the source becomes nullish', () => {
        const source = ref(createBlob('a'))
        const { url } = mountObjectUrl(source)
        const first = url.value

        source.value = null
        expect(url.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)

        source.value = void 0
        expect(url.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledOnce()

        source.value = createBlob('b')
        expect(url.value).toMatch(/^blob:/)
        expect(url.value).not.toBe(first)
      })

      test('keeps the URL when a getter re-runs with the same object', () => {
        const blob = createBlob('same')
        const unrelated = ref(0)
        const { url } = mountObjectUrl(() =>
          unrelated.value >= 0 ? blob : null
        )
        const first = url.value

        unrelated.value++

        expect(url.value).toBe(first)
        expect(revokeSpy).not.toHaveBeenCalled()
      })

      test('revokes the URL when the component gets destroyed', () => {
        const { wrapper, url } = mountObjectUrl(createBlob('bye'))
        const first = url.value

        wrapper.unmount()

        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        expect(url.value).toBeNull()
      })

      test('stop() revokes the URL and ends the tracking', () => {
        const source = ref(createBlob('a'))
        const { url, stop } = mountObjectUrl(source)
        const first = url.value

        stop()

        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)
        expect(url.value).toBeNull()

        source.value = createBlob('b')
        expect(url.value).toBeNull()
        expect(revokeSpy).toHaveBeenCalledOnce()
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const source = ref(createBlob('a'))
        const { url, stop } = useObjectUrl(source)
        const first = url.value

        expect(first).toMatch(/^blob:/)

        source.value = createBlob('b')
        expect(url.value).not.toBe(first)
        expect(revokeSpy).toHaveBeenCalledExactlyOnceWith(first)

        stop()
        expect(url.value).toBeNull()
        expect(warn).not.toHaveBeenCalled()
      })
    })
  })
})
