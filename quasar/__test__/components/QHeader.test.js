import Vue from 'vue'
import QHeader from '@components/QHeader';

describe('QHeader', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QHeader)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
