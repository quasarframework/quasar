import Vue from 'vue'
import QMenu from '@components/QMenu';

describe('QMenu', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QMenu)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
