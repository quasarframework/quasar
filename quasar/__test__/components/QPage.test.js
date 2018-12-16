import Vue from 'vue'
import QPage from '@components/QPage';

describe('QPage', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPage)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
