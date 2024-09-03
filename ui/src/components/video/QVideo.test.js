import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QVideo from './QVideo.js'

describe('[QVideo API]', () => {
  describe('[Props]', () => {
    describe('[(prop)ratio]', () => {
      test.each([
        [ 'String', '5' ],
        [ 'Number', 5 ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QVideo, {
          props: {
            src: 'https://www.youtube.com/embed/k3_tw44QsZQ'
          }
        })

        expect(
          wrapper.get('.q-video')
            .$style('padding-bottom')
        ).toBe('')

        await wrapper.setProps({ ratio: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-video')
            .$style('padding-bottom')
        ).toBe('20%')
      })
    })

    describe('[(prop)src]', () => {
      test('type String has effect', () => {
        const propVal = 'https://www.youtube.com/embed/k3_tw44QsZQ'
        const wrapper = mount(QVideo, {
          props: {
            src: propVal
          }
        })

        expect(
          wrapper.get('iframe')
            .attributes('src')
        ).toBe(propVal)
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QVideo, {
          props: {
            src: 'https://www.youtube.com/embed/k3_tw44QsZQ'
          }
        })

        expect(
          wrapper.get('iframe')
            .attributes('title')
        ).toBeUndefined()

        const propVal = 'My Daily Marathon'
        await wrapper.setProps({ title: propVal })
        await flushPromises()

        expect(
          wrapper.get('iframe')
            .attributes('title')
        ).toBe(propVal)
      })
    })

    describe('[(prop)fetchpriority]', () => {
      test.each([
        [ 'high' ],
        [ 'low' ],
        [ 'auto' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(QVideo, {
          props: {
            src: 'https://www.youtube.com/embed/k3_tw44QsZQ'
          }
        })

        expect(
          wrapper.get('iframe')
            .attributes('fetchpriority')
        ).toBe('auto')

        await wrapper.setProps({ fetchpriority: propVal })
        await flushPromises()

        expect(
          wrapper.get('iframe')
            .attributes('fetchpriority')
        ).toBe(propVal)
      })
    })

    describe('[(prop)loading]', () => {
      test.each([
        [ 'eager' ],
        [ 'lazy' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(QVideo, {
          props: {
            src: 'https://www.youtube.com/embed/k3_tw44QsZQ'
          }
        })

        expect(
          wrapper.get('iframe')
            .attributes('loading')
        ).toBe('eager')

        await wrapper.setProps({ loading: propVal })
        await flushPromises()

        expect(
          wrapper.get('iframe')
            .attributes('loading')
        ).toBe(propVal)
      })
    })

    describe('[(prop)referrerpolicy]', () => {
      test.each([
        [ 'no-referrer' ],
        [ 'no-referrer-when-downgrade' ],
        [ 'origin' ],
        [ 'origin-when-cross-origin' ],
        [ 'same-origin' ],
        [ 'strict-origin' ],
        [ 'strict-origin-when-cross-origin' ],
        [ 'unsafe-url' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(QVideo, {
          props: {
            src: 'https://www.youtube.com/embed/k3_tw44QsZQ'
          }
        })

        expect(
          wrapper.get('iframe')
            .attributes('referrerpolicy')
        ).toBe('strict-origin-when-cross-origin')

        await wrapper.setProps({ referrerpolicy: propVal })
        await flushPromises()

        expect(
          wrapper.get('iframe')
            .attributes('referrerpolicy')
        ).toBe(propVal)
      })
    })
  })
})
