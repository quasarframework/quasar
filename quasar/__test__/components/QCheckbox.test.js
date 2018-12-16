import Vue from 'vue'
import QCheckbox from '@components/QCheckbox';

describe('QCheckbox', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCheckbox)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
