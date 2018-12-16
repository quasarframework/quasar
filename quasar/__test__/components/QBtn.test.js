import Vue from 'vue'
import QBtn from '@components/QBtn';

describe('QBtn', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBtn)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
