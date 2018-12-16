import Vue from 'vue'
import QCardSection from '@components/QCardSection';

describe('QCardSection', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCardSection)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
