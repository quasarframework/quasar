import Vue from 'vue'
import QSeparator from '@components/QSeparator';

describe('QSeparator', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSeparator)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
