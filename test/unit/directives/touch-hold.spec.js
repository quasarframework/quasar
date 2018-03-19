import { mouseEvents } from '../../mocks/'
import TouchHold from '@/directives/touch-hold'
import { mount } from '@vue/test-utils'

describe('TouchHold fires and aborts appropriately', () => {
  let isFired

  beforeEach(() => {
    isFired = false
  })

  let wrapper = mount({template: `<div v-touch-hold="handler" />`,
    directives: {TouchHold},
    methods: { handler () { isFired = true } }
  })

  test('should not fire immediately', () => {
    wrapper.trigger('touchstart', mouseEvents.middle)
    wrapper.trigger('touchend', mouseEvents.middle)
    expect(isFired).toBe(false)
  })
  test('should fire after 600ms', async () => {
    wrapper.trigger('touchstart', mouseEvents.middle)

    return new Promise((resolve) => setTimeout(() => {
      wrapper.trigger('touchend', mouseEvents.middle)
      expect(isFired).toBe(true)
      resolve()
    }, 600))
  })
})
