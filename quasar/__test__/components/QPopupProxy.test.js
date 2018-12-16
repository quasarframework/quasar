import Vue from 'vue'
import QPopupProxy from '@components/QPopupProxy';

describe('QPopupProxy', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPopupProxy)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
