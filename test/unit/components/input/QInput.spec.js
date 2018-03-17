import { mount } from '@vue/test-utils'
import { QInput } from '@/components/input'
import { $q } from '../../../mocks/'

describe('QInput', () => {
  test('renders a text input', () => {
    const wrapper = mount(QInput, {
      propsData: {
        value: ''
      },
      mocks: {
        $q
      }
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })
})
