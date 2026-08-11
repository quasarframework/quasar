import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QSkeleton from './QSkeleton.js'

function expectType(type) {
  const wrapper = mount(QSkeleton, {
    props: { type }
  })

  expect(wrapper.classes()).toContain(`q-skeleton--type-${type}`)
}

function expectAnimation(animation) {
  const wrapper = mount(QSkeleton, {
    props: { animation }
  })

  if (animation === 'none') {
    expect(wrapper.classes()).not.toContain('q-skeleton--anim')
  } else {
    expect(wrapper.classes()).toContain('q-skeleton--anim')
    expect(wrapper.classes()).toContain(`q-skeleton--anim-${animation}`)
  }
}

describe('[QSkeleton API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { dark: true }
        })

        expect(wrapper.classes()).toContain('q-skeleton--dark')
        expect(wrapper.classes()).not.toContain('q-skeleton--light')
      })

      test('type null has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { dark: null }
        })

        expect(wrapper.classes()).toContain('q-skeleton--light')
        expect(wrapper.classes()).not.toContain('q-skeleton--dark')
      })
    })

    describe('[(prop)type]', () => {
      test('value "text" has effect', () => {
        expectType('text')
      })

      test('value "rect" has effect', () => {
        expectType('rect')
      })

      test('value "circle" has effect', () => {
        expectType('circle')
      })

      test('value "QBtn" has effect', () => {
        expectType('QBtn')
      })

      test('value "QBadge" has effect', () => {
        expectType('QBadge')
      })

      test('value "QChip" has effect', () => {
        expectType('QChip')
      })

      test('value "QToolbar" has effect', () => {
        expectType('QToolbar')
      })

      test('value "QCheckbox" has effect', () => {
        expectType('QCheckbox')
      })

      test('value "QRadio" has effect', () => {
        expectType('QRadio')
      })

      test('value "QToggle" has effect', () => {
        expectType('QToggle')
      })

      test('value "QSlider" has effect', () => {
        expectType('QSlider')
      })

      test('value "QRange" has effect', () => {
        expectType('QRange')
      })

      test('value "QInput" has effect', () => {
        expectType('QInput')
      })

      test('value "QAvatar" has effect', () => {
        expectType('QAvatar')
      })
    })

    describe('[(prop)animation]', () => {
      test('value "wave" has effect', () => {
        expectAnimation('wave')
      })

      test('value "pulse" has effect', () => {
        expectAnimation('pulse')
      })

      test('value "pulse-x" has effect', () => {
        expectAnimation('pulse-x')
      })

      test('value "pulse-y" has effect', () => {
        expectAnimation('pulse-y')
      })

      test('value "fade" has effect', () => {
        expectAnimation('fade')
      })

      test('value "blink" has effect', () => {
        expectAnimation('blink')
      })

      test('value "none" has effect', () => {
        expectAnimation('none')
      })
    })

    describe('[(prop)animation-speed]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { animationSpeed: '750' }
        })

        expect(wrapper.attributes('style')).toContain(
          '--q-skeleton-speed: 750ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { animationSpeed: 900 }
        })

        expect(wrapper.attributes('style')).toContain(
          '--q-skeleton-speed: 900ms'
        )
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { square: true }
        })

        expect(wrapper.classes()).toContain('q-skeleton--square')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { bordered: true }
        })

        expect(wrapper.classes()).toContain('q-skeleton--bordered')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { size: '48px' }
        })

        expect(wrapper.attributes('style')).toContain('width: 48px')
        expect(wrapper.attributes('style')).toContain('height: 48px')
      })
    })

    describe('[(prop)width]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { width: '160px' }
        })

        expect(wrapper.attributes('style')).toContain('width: 160px')
      })
    })

    describe('[(prop)height]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { height: '32px' }
        })

        expect(wrapper.attributes('style')).toContain('height: 32px')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QSkeleton, {
          props: { tag: 'span' }
        })

        expect(wrapper.element.tagName).toBe('SPAN')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Skeleton fallback content'
        const wrapper = mount(QSkeleton, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
