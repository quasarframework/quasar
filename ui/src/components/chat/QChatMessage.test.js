import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QChatMessage from './QChatMessage.js'

describe('[QChatMessage API]', () => {
  describe('[Props]', () => {
    describe('[(prop)sent]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            sent: true,
            text: ['Message content']
          }
        })

        expect(wrapper.classes()).toContain('q-message-sent')
        expect(wrapper.get('.q-message-container').classes()).toContain(
          'reverse'
        )
        expect(wrapper.get('.q-message-text').classes()).toContain(
          'q-message-text--sent'
        )
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: { label: 'Friday, 18th' }
        })

        expect(wrapper.get('.q-message-label').text()).toBe('Friday, 18th')
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            bgColor: 'primary',
            text: ['Message content']
          }
        })

        expect(wrapper.get('.q-message-text').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            textColor: 'primary',
            text: ['Message content']
          }
        })

        expect(wrapper.get('.q-message-text-content').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: { name: 'John Doe' }
        })

        expect(wrapper.get('.q-message-name').text()).toBe('John Doe')
      })
    })

    describe('[(prop)avatar]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: { avatar: 'https://example.test/avatar.png' }
        })
        const avatar = wrapper.get('.q-message-avatar')

        expect(avatar.attributes('src')).toBe('https://example.test/avatar.png')
        expect(avatar.attributes('aria-hidden')).toBe('true')
      })
    })

    describe('[(prop)text]', () => {
      test('type Array has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: { text: ['How are you?', 'Are you free later?'] }
        })
        const messages = wrapper.findAll('.q-message-text-content')

        expect(messages).toHaveLength(2)
        expect(messages.map(message => message.text())).toStrictEqual([
          'How are you?',
          'Are you free later?'
        ])
      })
    })

    describe('[(prop)stamp]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            stamp: '13:55',
            text: ['Message content']
          }
        })

        expect(wrapper.get('.q-message-stamp').text()).toBe('13:55')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: { size: '4' }
        })

        expect(wrapper.get('.q-message-container > div').classes()).toContain(
          'col-4'
        )
      })
    })

    describe('[(prop)label-html]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            label: '<strong>Friday</strong>',
            labelHtml: true
          }
        })

        expect(wrapper.get('.q-message-label strong').text()).toBe('Friday')
      })
    })

    describe('[(prop)name-html]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            name: '<strong>John</strong>',
            nameHtml: true
          }
        })

        expect(wrapper.get('.q-message-name strong').text()).toBe('John')
      })
    })

    describe('[(prop)text-html]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            text: ['<strong>Message</strong>'],
            textHtml: true
          }
        })

        expect(wrapper.get('.q-message-text-content strong').text()).toBe(
          'Message'
        )
      })
    })

    describe('[(prop)stamp-html]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QChatMessage, {
          props: {
            stamp: '<strong>13:55</strong>',
            stampHtml: true,
            text: ['Message content']
          }
        })

        expect(wrapper.get('.q-message-stamp strong').text()).toBe('13:55')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Message slot content'
        const wrapper = mount(QChatMessage, {
          slots: {
            default: () => h('span', slotContent)
          }
        })

        expect(wrapper.get('.q-message-text-content').text()).toBe(slotContent)
      })
    })

    describe('[(slot)avatar]', () => {
      test('renders the content', () => {
        const slotContent = 'Avatar slot content'
        const wrapper = mount(QChatMessage, {
          slots: {
            avatar: () => slotContent
          }
        })

        expect(wrapper.get('.q-message-container').text()).toContain(
          slotContent
        )
      })
    })

    describe('[(slot)name]', () => {
      test('renders the content', () => {
        const slotContent = 'Name slot content'
        const wrapper = mount(QChatMessage, {
          slots: {
            name: () => slotContent
          }
        })

        expect(wrapper.get('.q-message-name').text()).toBe(slotContent)
      })
    })

    describe('[(slot)stamp]', () => {
      test('renders the content', () => {
        const slotContent = 'Stamp slot content'
        const wrapper = mount(QChatMessage, {
          slots: {
            default: () => h('span', 'Message content'),
            stamp: () => slotContent
          }
        })

        expect(wrapper.get('.q-message-stamp').text()).toBe(slotContent)
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const slotContent = 'Label slot content'
        const wrapper = mount(QChatMessage, {
          slots: {
            label: () => slotContent
          }
        })

        expect(wrapper.get('.q-message-label').text()).toBe(slotContent)
      })
    })
  })
})
