import Vue from 'vue'
import QToolbarTitle from '@components/QToolbarTitle';

describe('QToolbarTitle', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QToolbarTitle)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
