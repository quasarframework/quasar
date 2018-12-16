import Vue from 'vue'
import QBtnDropdown from '@components/QBtnDropdown';

describe('QBtnDropdown', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBtnDropdown)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
