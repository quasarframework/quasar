import { mount } from '@vue/test-utils'
import { QCheckbox } from '@/components/checkbox'
import { $q } from '../../../mocks/'

describe('QCheckbox', () => {
  test('updates value on click', () => {
    const wrapper = mount(QCheckbox, {
      propsData: {
        value: true
      },
      mocks: {
        $q
      }
    })
    wrapper.element.click()
    const inputEvents = wrapper.emitted('input')
    expect(inputEvents.length).toBe(1)
    expect(inputEvents[0][0]).toBe(false)
  })
})
