import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCircularProgress from './QCircularProgress.js'

describe('[QCircularProgress API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { size: '16px' }
        })

        expect(wrapper.attributes('style')).toContain('font-size: 16px')
      })
    })

    describe('[(prop)value]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { value: 40 }
        })

        expect(wrapper.attributes('aria-valuenow')).toBe('40')
      })
    })

    describe('[(prop)min]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: {
            min: 10,
            value: 25
          }
        })

        expect(wrapper.attributes('aria-valuemin')).toBe('10')
        expect(wrapper.attributes('aria-valuenow')).toBe('25')
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: {
            max: 200,
            value: 150
          }
        })

        expect(wrapper.attributes('aria-valuemax')).toBe('200')
        expect(wrapper.attributes('aria-valuenow')).toBe('150')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { color: 'primary' }
        })

        expect(wrapper.get('.q-circular-progress__circle').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)center-color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { centerColor: 'primary' }
        })

        expect(wrapper.get('.q-circular-progress__center').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)track-color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { trackColor: 'primary' }
        })

        expect(wrapper.get('.q-circular-progress__track').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)font-size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: {
            fontSize: '1em',
            showValue: true
          }
        })

        expect(
          wrapper.get('.q-circular-progress__text').attributes('style')
        ).toContain('font-size: 1em')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { rounded: true }
        })

        expect(
          wrapper
            .get('.q-circular-progress__circle')
            .attributes('stroke-linecap')
        ).toBe('round')
      })
    })

    describe('[(prop)thickness]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { thickness: 0.4 }
        })

        expect(
          Number(
            wrapper
              .get('.q-circular-progress__circle')
              .attributes('stroke-width')
          )
        ).toBeGreaterThan(20)
      })
    })

    describe('[(prop)angle]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { angle: 45 }
        })

        expect(
          wrapper.get('.q-circular-progress__svg').attributes('style')
        ).toContain('rotate3d(0, 0, 1, -45deg)')
      })
    })

    describe('[(prop)indeterminate]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: {
            indeterminate: true,
            value: 40
          }
        })

        expect(wrapper.classes()).toContain(
          'q-circular-progress--indeterminate'
        )
        expect(wrapper.attributes()).not.toHaveProperty('aria-valuenow')
      })
    })

    describe('[(prop)show-value]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: {
            showValue: true,
            value: 40
          }
        })

        expect(wrapper.get('.q-circular-progress__text').text()).toBe('40')
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { reverse: true }
        })

        expect(
          wrapper.get('.q-circular-progress__svg').attributes('style')
        ).toContain('scale3d(-1, 1, 1)')
      })
    })

    describe('[(prop)instant-feedback]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { instantFeedback: true }
        })

        expect(
          wrapper.get('.q-circular-progress__circle').attributes('style')
        ).toBe('')
      })
    })

    describe('[(prop)animation-speed]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { animationSpeed: '1200' }
        })

        expect(
          wrapper.get('.q-circular-progress__circle').attributes('style')
        ).toContain('1200ms')
      })

      test('type Number has effect', () => {
        const wrapper = mount(QCircularProgress, {
          props: { animationSpeed: 750 }
        })

        expect(
          wrapper.get('.q-circular-progress__circle').attributes('style')
        ).toContain('750ms')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Progress value'
        const wrapper = mount(QCircularProgress, {
          props: { showValue: true },
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-circular-progress__text').text()).toBe(
          slotContent
        )
      })
    })
  })
})
