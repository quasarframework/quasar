import Vue from 'vue'
import QList from '@components/QList';

describe('QList', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QList)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
