import { mount } from '@vue/test-utils'
import { QCheckbox } from '@/components/checkbox'

describe('QCheckbox', () => {
  test('updates value on click', () => {
    const wrapper = mount(QCheckbox, {
      propsData: {
        value: false
      }
    })
    wrapper.element.click()
    expect(wrapper.props.value).toBe(true)
  })
})
