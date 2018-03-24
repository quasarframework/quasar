import { mount } from '@vue/test-utils'
import { QCard } from '@/components/card'

describe('QCard', () => {
    test('should wrap contents', () => {
        const wrapper = mount(QCard,{
            slots:{
                default:`<div>Quasar</div>`
            }
        })
      
      expect(wrapper.text()).toBe('Quasar')
    })
})  