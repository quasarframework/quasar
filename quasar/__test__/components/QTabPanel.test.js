import Vue from 'vue'
import QTabPanel from '@components/QTabPanel';

describe('QTabPanel', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTabPanel)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
