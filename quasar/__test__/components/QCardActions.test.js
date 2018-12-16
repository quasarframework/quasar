import Vue from 'vue'
import QCardActions from '@components/QCardActions';

describe('QCardActions', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCardActions)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
