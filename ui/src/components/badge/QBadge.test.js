import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBadge from './QBadge.js'

describe('[QBadge API]', () => {
  describe('[Props]', () => {
    describe('[(prop)color]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.color).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            color: 'red'
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.textColor).toBeDefined()
      })

      test('type String has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            textColor: 'red'
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('text-red')
      })
    })

    describe('[(prop)floating]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.floating).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            floating: true
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--floating')

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('position')
        ).toBe('absolute')
      })
    })

    describe('[(prop)transparent]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.transparent).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            transparent: true
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--transparent')

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('opacity')
        ).not.toBe('1')
      })
    })

    describe('[(prop)multi-line]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.multiLine).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            multiLine: true
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--multi-line')

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('word-break')
        ).toBe('break-all')
      })
    })

    describe('[(prop)label]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.label).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'John Doe'
        const wrapper = mount(QBadge, {
          props: {
            label: propVal
          }
        })

        expect(
          wrapper.get('.q-badge')
            .text()
        ).toContain(propVal)
      })

      test('type Number has effect', () => {
        const propVal = 22
        const wrapper = mount(QBadge, {
          props: {
            label: propVal
          }
        })

        expect(
          wrapper.get('.q-badge')
            .text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)align]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.align).toBeDefined()
      })

      test('value "top" has effect', () => {
        const propVal = 'top'
        const wrapper = mount(QBadge, {
          props: {
            align: propVal
          }
        })

        expect(
          wrapper.get('.q-badge')
            .$style('vertical-align')
        ).toBe(propVal)
      })

      test('value "middle" has effect', () => {
        const propVal = 'middle'
        const wrapper = mount(QBadge, {
          props: {
            align: propVal
          }
        })

        expect(
          wrapper.get('.q-badge')
            .$style('vertical-align')
        ).toBe(propVal)
      })

      test('value "bottom" has effect', () => {
        const propVal = 'bottom'
        const wrapper = mount(QBadge, {
          props: {
            align: propVal
          }
        })

        expect(
          wrapper.get('.q-badge')
            .$style('vertical-align')
        ).toBe(propVal)
      })
    })

    describe('[(prop)outline]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.outline).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            outline: true
          }
        })

        expect(
          wrapper.get('.q-badge')
            .classes()
        ).toContain('q-badge--outline')

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('border')
        ).toContain('1px solid')
      })
    })

    describe('[(prop)rounded]', () => {
      test('is defined correctly', () => {
        expect(QBadge.props.rounded).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBadge, {
          props: {
            rounded: true
          }
        })

        expect(
          wrapper.get('.q-badge')
            .$computedStyle('border-radius')
        ).toBe('1em')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBadge, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
