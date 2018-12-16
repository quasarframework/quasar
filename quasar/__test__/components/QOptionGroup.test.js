import Vue from 'vue'
import QOptionGroup from '@components/QOptionGroup';

describe('QOptionGroup', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QOptionGroup)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
