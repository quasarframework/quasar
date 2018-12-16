import Vue from 'vue'
import QDate from '@components/QDate';

describe('QDate', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QDate)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
