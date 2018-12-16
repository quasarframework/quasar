import Vue from 'vue'
import QBtnToggle from '@components/QBtnToggle';

describe('QBtnToggle', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBtnToggle)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
