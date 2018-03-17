import { mount } from '@vue/test-utils'
import { QAlert } from '@/components/alert'

describe('QAlert', () => {
  test('displays text from message prop', () => {
    const wrapper = mount(QAlert, {
      propsData: {
        message: 'Hello Quasar'
      }
    })
    expect(wrapper.text()).toBe('Hello Quasar')
  })
})
