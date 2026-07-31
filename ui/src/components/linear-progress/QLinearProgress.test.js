import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QLinearProgress from './QLinearProgress.js'

describe('[QLinearProgress API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { size: '16px' }
        })

        expect(wrapper.attributes('style')).toContain('font-size: 16px')
      })
    })

    describe('[(prop)value]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { value: 0.4 }
        })

        expect(
          wrapper.get('.q-linear-progress__model').attributes('style')
        ).toContain('transform: scale3d(0.4,1,1)')
        expect(wrapper.attributes('aria-valuenow')).toBe('0.4')
      })
    })

    describe('[(prop)buffer]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { buffer: 0.6 }
        })

        expect(
          wrapper.get('.q-linear-progress__track').attributes('style')
        ).toContain('transform: scale3d(0.6,1,1)')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { color: 'primary' }
        })

        expect(wrapper.classes()).toContain('text-primary')
      })
    })

    describe('[(prop)track-color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { trackColor: 'secondary' }
        })

        expect(wrapper.get('.q-linear-progress__track').classes()).toContain(
          'bg-secondary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { dark: true }
        })

        expect(wrapper.get('.q-linear-progress__track').classes()).toContain(
          'q-linear-progress__track--dark'
        )
      })

      test('type null has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { dark: null }
        })

        expect(wrapper.get('.q-linear-progress__track').classes()).toContain(
          'q-linear-progress__track--light'
        )
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { reverse: true }
        })

        expect(wrapper.classes()).toContain('q-linear-progress--reverse')
      })
    })

    describe('[(prop)stripe]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: {
            stripe: true,
            value: 0.4
          }
        })
        const stripe = wrapper.get('.q-linear-progress__stripe')

        expect(stripe.attributes('style')).toContain('width: 40%')
        expect(stripe.classes()).toContain('absolute-left')
      })
    })

    describe('[(prop)indeterminate]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { indeterminate: true }
        })

        expect(wrapper.get('.q-linear-progress__model').classes()).toContain(
          'q-linear-progress__model--indeterminate'
        )
        expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
      })
    })

    describe('[(prop)query]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { query: true }
        })

        expect(wrapper.classes()).toContain('q-linear-progress--reverse')
        expect(wrapper.get('.q-linear-progress__model').classes()).toContain(
          'q-linear-progress__model--indeterminate'
        )
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { rounded: true }
        })

        expect(wrapper.classes()).toContain('rounded-borders')
      })
    })

    describe('[(prop)instant-feedback]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: {
            instantFeedback: true,
            stripe: true
          }
        })

        expect(wrapper.get('.q-linear-progress__track').classes()).toContain(
          'q-linear-progress__track--without-transition'
        )
        expect(wrapper.get('.q-linear-progress__model').classes()).toContain(
          'q-linear-progress__model--without-transition'
        )
        expect(wrapper.get('.q-linear-progress__stripe').classes()).toContain(
          'q-linear-progress__stripe--without-transition'
        )
      })
    })

    describe('[(prop)animation-speed]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { animationSpeed: '1200' }
        })

        expect(wrapper.attributes('style')).toContain(
          '--q-linear-progress-speed: 1200ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mount(QLinearProgress, {
          props: { animationSpeed: 1800 }
        })

        expect(wrapper.attributes('style')).toContain(
          '--q-linear-progress-speed: 1800ms'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Linear progress content'
        const wrapper = mount(QLinearProgress, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })
})
