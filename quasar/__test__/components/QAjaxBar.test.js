import Vue from 'vue'
import QAjaxBar from '@components/QAjaxBar';

describe('QAjaxBar', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QAjaxBar)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
