import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QAvatar from './QAvatar.js'

describe('[QAvatar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)icon]', () => {
      test('should render an icon', () => {
        const icon = 'bug_report'
        const wrapper = mount(QAvatar, {
          props: {
            icon,
            color: 'grey'
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .get('.q-icon')
            .text()
        ).toContain(`${ icon }`)
      })
    })

    describe('[(prop)font-size]', () => {
      test('should set the font-size', () => {
        const size = '40px'
        // Doing em/rem units here does not work
        // Cypress looks at actual computed values in the browser
        const fontSize = '32px'
        const wrapper = mount(QAvatar, {
          props: {
            size,
            fontSize,
            color: 'grey'
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
      test('should set a background color', () => {
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
      test('should set a text color', () => {
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

    describe('[(prop)square]', () => {
      test('should create a square avatar', () => {
        const wrapper = mount(QAvatar, {
          props: {
            square: true,
            color: 'grey'
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .classes()
        ).toContain('q-avatar--square')

        expect(
          wrapper.get('.q-avatar')
            .$computedStyle('border-radius')
        ).toBe('0')
      })
    })

    describe('[(prop)rounded]', () => {
      test('should create a rounded avatar', () => {
        const wrapper = mount(QAvatar, {
          props: {
            rounded: true,
            color: 'grey'
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .classes()
        ).toContain('rounded-borders')
      })
    })

    describe.todo('(prop): size', () => {
      test(' ', () => {
        //
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('render the text in the default slot', () => {
        const text = 'QQ'
        const wrapper = mount(QAvatar, {
          slots: {
            // Using only a string here results in an error, this is a workaround
            default: () => text
          }
        })

        expect(
          wrapper.get('.q-avatar')
            .text()
        ).toContain(text)
      })
    })
  })
})
