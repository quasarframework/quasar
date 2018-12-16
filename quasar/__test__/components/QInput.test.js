import Vue from 'vue'
import QInput from '@components/QInput';

describe('QInput', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QInput)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
