import Vue from 'vue'
import QLayout from '@components/QLayout';

describe('QLayout', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QLayout)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
