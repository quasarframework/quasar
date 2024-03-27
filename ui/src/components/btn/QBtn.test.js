import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QBtn from './QBtn.js'

const defaultOptions = {
  label: 'simple Btn'
}

function mountQBtn (options = {}) {
  options.props = {
    ...defaultOptions,
    ...options.props
  }

  return mount(QBtn, options)
}

describe('[QBtn API]', () => {
  describe('[Props]', () => {
    describe('[(prop)percentage]', () => {
      test('should render a button with a percentage when "loading" prop is set to true', () => {
        const percentage = 50
        const wrapper = mountQBtn({
          props: {
            percentage,
            loading: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe(percentage.toString())
      })
    })

    describe('[(prop)dark-percentage]', () => {
      test('should render a button with a dark percentage when "loading" prop is set to true', () => {
        const percentage = 50
        const wrapper = mountQBtn({
          props: {
            percentage,
            loading: true,
            darkPercentage: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe(percentage.toString())

        expect(
          wrapper.get('.q-btn__progress')
            .classes()
        ).toContain('q-btn__progress--dark')
      })
    })

    describe.todo('(prop): loading', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): disable', () => {
      test(' ', () => {
        //
      })
    })

    describe('[(prop)round]', () => {
      test('should render a circle shaped button when "round" prop is set to true', () => {
        const wrapper = mountQBtn({
          props: {
            round: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .classes()
        ).toContain('q-btn--round')
      })
    })

    describe.todo('(prop): size', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): outline', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): flat', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): unelevated', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): rounded', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): push', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): square', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): glossy', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): fab', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): fab-mini', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): padding', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): color', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): text-color', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): dense', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): ripple', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): type', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): tabindex', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): to', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): exact', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): replace', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): active-class', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): exact-active-class', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): href', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): target', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): label', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): icon', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): icon-right', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): no-caps', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): no-wrap', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): align', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): stack', () => {
      test(' ', () => {
        //
      })
    })

    describe.todo('(prop): stretch', () => {
      test(' ', () => {
        //
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should render a button with a label', () => {
        const wrapper = mountQBtn()

        expect(
          wrapper.get('.q-btn')
            .text()
        ).toContain(defaultOptions.label)
      })
    })

    describe('[(slot)loading]', () => {
      test('should render a button with a loading slot', () => {
        const loadingSlot = 'loading slot'
        const wrapper = mountQBtn({
          props: {
            loading: true
          },
          slots: {
            loading: loadingSlot
          }
        })

        const text = wrapper.get('.q-btn').text()
        expect(text).toContain(loadingSlot)
        expect(text).toContain(defaultOptions.label)

        expect(
          wrapper.get('.q-btn__content')
            .isVisible()
        ).not.toBe(true)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('should emit a click event when the button is clicked', () => {
        const fn = vi.fn()
        const wrapper = mountQBtn({
          props: {
            onClick: fn
          }
        })

        wrapper.get('.q-btn').trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)click]', () => {
      test('should click the button', () => {
        const fn = vi.fn()
        const wrapper = mountQBtn({
          props: {
            onClick: fn
          }
        })

        wrapper.trigger('click')

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })
})
