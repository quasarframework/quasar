import Vue from 'vue'
import QRadio from '@components/QRadio';

describe('QRadio', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QRadio)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
