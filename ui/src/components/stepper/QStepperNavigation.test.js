import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QStepperNavigation from './QStepperNavigation.js'

describe('[QStepperNavigation API]', () => {
  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QStepperNavigation, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-stepper__nav').text()).toContain(slotContent)
      })
    })
  })
})
