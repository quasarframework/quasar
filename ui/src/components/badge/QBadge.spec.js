import { mount } from '@cypress/vue'
import QBadge from './QBadge'

describe('QBadge', () => {
  it('renders a QBadge', () => {
    mount(QBadge, {
      props: {
        label: 'test',
        color: 'primary'
      }
    })
  })
})
