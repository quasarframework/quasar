import Vue from 'vue'
import QMarkupTable from '@components/QMarkupTable';

describe('QMarkupTable', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QMarkupTable)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
