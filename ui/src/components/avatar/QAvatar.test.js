import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QAvatar from './QAvatar.js'
import { useSizeDefaults } from 'quasar/src/composables/private/use-size.js'

describe('[QAvatar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.size).toBeDefined()
      })

      test('type String has effect', async () => {
        const propVal = '16px'
        const wrapper = mount(QAvatar, {
          props: {
            size: propVal
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .$style()
        ).toContain(`font-size: ${ propVal };`)

        await wrapper.setProps({ size: 'sm' })

        expect(
          wrapper.get('.q-avatar')
            .$style()
        ).toContain(`font-size: ${ useSizeDefaults.sm }px;`)
      })
    })

    describe('[(prop)font-size]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.fontSize).toBeDefined()
      })

      test('type String has effect', () => {
        const size = '200px'
        const fontSize = '100px'

        const wrapper = mount(QAvatar, {
          props: {
            size,
            fontSize
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .$style()
        ).toContain(`font-size: ${ size };`)

        expect(
          wrapper.get('.q-avatar__content')
            .$style()
        ).toContain(`font-size: ${ fontSize };`)
      })
    })

    describe('[(prop)color]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.color).toBeDefined()
      })

      test('type String has effect', () => {
        const color = 'red'
        const wrapper = mount(QAvatar, {
          props: {
            color
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .classes()
        ).toContain(`bg-${ color }`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.textColor).toBeDefined()
      })

      test('type String has effect', () => {
        const textColor = 'red'
        const wrapper = mount(QAvatar, {
          props: {
            textColor
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .classes()
        ).toContain(`text-${ textColor }`)
      })
    })

    describe('[(prop)icon]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.icon).toBeDefined()
      })

      test('type String has effect', () => {
        const icon = 'bug_report'
        const wrapper = mount(QAvatar, {
          props: {
            icon
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .get('.q-icon')
            .text()
        ).toContain(`${ icon }`)
      })
    })

    describe('[(prop)square]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.square).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QAvatar, {
          props: {
            square: true
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .$computedStyle('border-radius')
        ).toBe('0')
      })
    })

    describe('[(prop)rounded]', () => {
      test('is defined correctly', () => {
        expect(QAvatar.props.rounded).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QAvatar, {
          props: {
            rounded: true
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .$computedStyle('border-radius')
        ).toBe('4px')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QAvatar, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
