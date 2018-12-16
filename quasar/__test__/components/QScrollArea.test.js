import Vue from 'vue'
import QScrollArea from '@components/QScrollArea';

describe('QScrollArea', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QScrollArea)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
