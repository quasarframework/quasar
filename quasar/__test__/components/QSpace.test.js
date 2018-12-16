import Vue from 'vue'
import QSpace from '@components/QSpace';

describe('QSpace', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpace)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
