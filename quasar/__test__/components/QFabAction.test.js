import Vue from 'vue'
import QFabAction from '@components/QFabAction';

describe('QFabAction', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QFabAction)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
