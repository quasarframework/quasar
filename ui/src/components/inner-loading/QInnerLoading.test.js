import { Transition } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QInnerLoading from './QInnerLoading.js'

function mountLoading(props = {}, slots = {}) {
  return mount(QInnerLoading, {
    props: {
      showing: true,
      ...props
    },
    slots
  })
}

describe('[QInnerLoading API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ transitionShow: 'slide-down' })

        expect(wrapper.getComponent(Transition).props('enterActiveClass')).toBe(
          'q-transition--slide-down-enter-active'
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ transitionHide: 'slide-up' })

        expect(wrapper.getComponent(Transition).props('leaveActiveClass')).toBe(
          'q-transition--slide-up-leave-active'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ transitionDuration: '450' })

        expect(wrapper.get('.q-inner-loading').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mountLoading({ transitionDuration: 600 })

        expect(wrapper.get('.q-inner-loading').attributes('style')).toContain(
          '--q-transition-duration: 600ms'
        )
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ size: '48px' })
        const spinner = wrapper.get('.q-spinner')

        expect(spinner.attributes('width')).toBe('48px')
        expect(spinner.attributes('height')).toBe('48px')
      })

      test('type Number has effect', () => {
        const wrapper = mountLoading({ size: 36 })
        const spinner = wrapper.get('.q-spinner')

        expect(spinner.attributes('width')).toBe('36')
        expect(spinner.attributes('height')).toBe('36')
      })
    })

    describe('[(prop)showing]', () => {
      test('type Boolean has effect', () => {
        const hidden = mount(QInnerLoading, {
          props: { showing: false }
        })
        const showing = mountLoading()

        expect(hidden.find('.q-inner-loading').exists()).toBe(false)
        expect(showing.find('.q-inner-loading').exists()).toBe(true)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ color: 'secondary' })

        expect(wrapper.get('.q-spinner').classes()).toContain('text-secondary')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({ label: 'Please wait' })

        expect(wrapper.get('.q-inner-loading__label').text()).toBe(
          'Please wait'
        )
      })
    })

    describe('[(prop)label-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({
          label: 'Please wait',
          labelClass: 'text-red q-mt-xl'
        })

        expect(wrapper.get('.q-inner-loading__label').classes()).toEqual(
          expect.arrayContaining(['text-red', 'q-mt-xl'])
        )
      })
    })

    describe('[(prop)label-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountLoading({
          label: 'Please wait',
          labelStyle: 'font-size: 28px'
        })

        expect(
          wrapper.get('.q-inner-loading__label').attributes('style')
        ).toContain('font-size: 28px')
      })

      test('type Array has effect', () => {
        const wrapper = mountLoading({
          label: 'Please wait',
          labelStyle: [{ fontSize: '20px' }, { color: 'red' }]
        })
        const style = wrapper.get('.q-inner-loading__label').attributes('style')

        expect(style).toContain('font-size: 20px')
        expect(style).toContain('color: red')
      })

      test('type Object has effect', () => {
        const wrapper = mountLoading({
          label: 'Please wait',
          labelStyle: { color: 'rgb(255, 0, 0)' }
        })

        expect(
          wrapper.get('.q-inner-loading__label').attributes('style')
        ).toContain('color: rgb(255, 0, 0)')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountLoading({ dark: true })

        expect(wrapper.get('.q-inner-loading').classes()).toContain(
          'q-inner-loading--dark'
        )
      })

      test('type null has effect', () => {
        const wrapper = mountLoading({ dark: null })

        expect(wrapper.get('.q-inner-loading').classes()).not.toContain(
          'q-inner-loading--dark'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Custom loading content'
        const wrapper = mountLoading(
          { label: 'Ignored label' },
          { default: () => slotContent }
        )

        expect(wrapper.get('.q-inner-loading').text()).toBe(slotContent)
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
        expect(wrapper.find('.q-inner-loading__label').exists()).toBe(false)
      })
    })
  })
})
