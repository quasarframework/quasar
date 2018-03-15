import { mount } from '@vue/test-utils'
import { QBtn } from '@/components/btn'

describe('QBtn', () => {
  test('should emit click event on click', () => {
    const wrapper = mount(QBtn)
    wrapper.element.click()
    expect(wrapper.emitted().click).toBeTruthy()
  })

  test('renders a button', () => {
    const wrapper = mount(QBtn)
    expect(wrapper.is('button')).toBe(true)
  })

  test('displays label as passed', () => {
    const wrapper = mount(QBtn, {
      propsData: {
        label: 'Quasar'
      }
    })
    expect(wrapper.text()).toBe('Quasar')
  })

  test('should display loader while loading and hide when complete', () => {
    const wrapper = mount(QBtn, {
      propsData: {
        loading: true
      },
      slots: {
        loading: '<div id="loader" />'
      }
    })
    expect(wrapper.find('#loader').exists()).toBe(true)
    wrapper.setProps({loading: false})
    expect(wrapper.find('#loader').exists()).toBe(false)
  })
})
