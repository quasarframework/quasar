import Vue from 'vue'
import QDrawer from '@components/QDrawer';

describe('QDrawer', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QDrawer)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
