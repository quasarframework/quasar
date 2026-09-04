import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { h, nextTick, ref } from 'vue'

import InfiniteScrollLoading from './InfiniteScrollLoading.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function mountLoading(isFetching = false, slot = () => 'Loading...') {
  const store = { isFetching: ref(isFetching) }

  wrapper = mount(InfiniteScrollLoading, {
    props: { store },
    slots: { default: slot }
  })

  return { store, loading: wrapper.get('.q-infinite-scroll__loading') }
}

describe('[InfiniteScrollLoading API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(InfiniteScrollLoading).toBeTypeOf('object')
        expect(InfiniteScrollLoading.setup).toBeTypeOf('function')
        expect(InfiniteScrollLoading.props).$arrayValues(expect.any(String))
      })

      test('renders the slot', () => {
        const { loading } = mountLoading()

        expect(loading.text()).toBe('Loading...')
      })

      test('is only visible while fetching', async () => {
        const { store, loading } = mountLoading()

        expect(loading.classes()).toContain('invisible')

        store.isFetching.value = true
        await nextTick()

        expect(loading.classes()).not.toContain('invisible')
      })

      test('pauses the svg animations while hidden', async () => {
        const { store, loading } = mountLoading(false, () => h('svg'))
        const svg = loading.element.querySelector('svg')

        expect(svg.animationsPaused()).toBe(true)

        store.isFetching.value = true
        await nextTick()

        expect(svg.animationsPaused()).toBe(false)

        store.isFetching.value = false
        await nextTick()

        expect(svg.animationsPaused()).toBe(true)
      })
    })
  })
})
