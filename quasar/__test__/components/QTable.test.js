import Vue from 'vue'
import QTable from '@components/QTable';

describe('QTable', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTable)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
