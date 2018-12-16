import Vue from 'vue'
import QPopupEdit from '@components/QPopupEdit';

describe('QPopupEdit', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPopupEdit)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
