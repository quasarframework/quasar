import Vue from 'vue'
import QBtnGroup from '@components/QBtnGroup';

describe('QBtnGroup', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBtnGroup)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
