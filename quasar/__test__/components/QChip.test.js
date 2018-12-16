import Vue from 'vue'
import QChip from '@components/QChip';

describe('QChip', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QChip)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
