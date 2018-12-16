import Vue from 'vue'
import QTime from '@components/QTime';

describe('QTime', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTime)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
