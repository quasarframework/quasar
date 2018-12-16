import Vue from 'vue'
import QSpinnerGrid from '@components/QSpinnerGrid';

describe('QSpinnerGrid', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerGrid)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
