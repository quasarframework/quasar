import Vue from 'vue'
import QItemSection from '@components/QItemSection';

describe('QItemSection', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QItemSection)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
