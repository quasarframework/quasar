import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { nextTick, ref } from 'vue'

import PullToRefreshPuller from './PullToRefreshPuller.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function mountPuller(props = {}) {
  const store = {
    state: ref('pull'),
    pullRatio: ref(0.5),
    pullPosition: ref(30),
    animating: ref(false),
    positionCSS: ref({ top: '10px', left: '20px', width: '300px' })
  }

  wrapper = mount(PullToRefreshPuller, {
    props: { store, icon: 'refresh', ...props }
  })

  return {
    store,
    container: wrapper.get('.q-pull-to-refresh__puller-container'),
    puller: wrapper.get('.q-pull-to-refresh__puller')
  }
}

describe('[PullToRefreshPuller API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(PullToRefreshPuller).toBeTypeOf('object')
        expect(PullToRefreshPuller.setup).toBeTypeOf('function')
        expect(PullToRefreshPuller.props).$arrayValues(expect.any(String))
      })

      test('positions the container and moves the puller from the store', () => {
        const { store, container, puller } = mountPuller()

        expect(container.element.style.top).toBe(store.positionCSS.value.top)
        expect(container.element.style.left).toBe(store.positionCSS.value.left)
        expect(puller.element.style.opacity).toBe(String(store.pullRatio.value))
        expect(puller.element.style.transform).toBe(
          `translateY(${store.pullPosition.value}px) rotate(${store.pullRatio.value * 360}deg)`
        )
      })

      test('travels away from the pulled side', () => {
        const { store, puller } = mountPuller({ side: 'top' })
        const position = store.pullPosition.value
        const angle = store.pullRatio.value * 360

        expect(puller.element.style.transform).toBe(
          `translateY(${position}px) rotate(${angle}deg)`
        )

        wrapper.unmount()
        expect(
          mountPuller({ side: 'bottom' }).puller.element.style.transform
        ).toBe(`translateY(-${position}px) rotate(${angle}deg)`)

        wrapper.unmount()
        expect(
          mountPuller({ side: 'left' }).puller.element.style.transform
        ).toBe(`translateX(${position}px) rotate(${angle}deg)`)

        wrapper.unmount()
        expect(
          mountPuller({ side: 'right' }).puller.element.style.transform
        ).toBe(`translateX(-${position}px) rotate(${angle}deg)`)
      })

      test('shows the icon while pulling and a spinner while refreshing', async () => {
        const { store, puller } = mountPuller({ color: 'primary' })

        expect(puller.get('.q-icon').text()).toBe('refresh')
        expect(puller.get('.q-icon').classes()).toContain('text-primary')
        expect(puller.find('.q-spinner').exists()).toBe(false)

        store.state.value = 'refreshing'
        await nextTick()

        expect(puller.find('.q-icon').exists()).toBe(false)
        expect(puller.get('.q-spinner').classes()).toContain('text-primary')
      })

      test('paints the background and the animating class', async () => {
        const { store, puller } = mountPuller({ bgColor: 'secondary' })

        expect(puller.classes()).toContain('bg-secondary')
        expect(puller.classes()).not.toContain(
          'q-pull-to-refresh__puller--animating'
        )

        store.animating.value = true
        await nextTick()

        expect(puller.classes()).toContain(
          'q-pull-to-refresh__puller--animating'
        )
      })

      test('follows store updates without new props', async () => {
        const { store, puller } = mountPuller()

        store.pullRatio.value = 1
        store.pullPosition.value = 60
        await nextTick()

        expect(puller.element.style.opacity).toBe('1')
        expect(puller.element.style.transform).toBe(
          'translateY(60px) rotate(360deg)'
        )
      })
    })
  })
})
