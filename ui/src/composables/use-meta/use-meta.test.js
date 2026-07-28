import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import useMeta from './use-meta.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runAllTimers()
  vi.useRealTimers()
  document.title = ''
  document.head.querySelectorAll('[data-qmeta]').forEach(el => el.remove())
})

describe('[useMeta API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', async () => {
        const title = ref('Initial title')
        let result

        const wrapper = mount(
          defineComponent({
            setup() {
              result = useMeta(() => ({
                title: title.value,
                meta: {
                  description: {
                    name: 'description',
                    content: `${title.value} description`
                  }
                }
              }))
            },
            template: '<div />'
          })
        )

        expect(result).toBeUndefined()

        vi.runAllTimers()
        await nextTick()

        expect(document.title).toBe('Initial title')
        expect(
          document.head.querySelector('meta[data-qmeta="description"]').content
        ).toBe('Initial title description')

        title.value = 'Updated title'
        await nextTick()
        vi.runAllTimers()

        expect(document.title).toBe('Updated title')
        expect(
          document.head.querySelector('meta[data-qmeta="description"]').content
        ).toBe('Updated title description')

        wrapper.unmount()
        vi.runAllTimers()

        expect(
          document.head.querySelector('meta[data-qmeta="description"]')
        ).toBe(null)
      })
    })
  })
})
