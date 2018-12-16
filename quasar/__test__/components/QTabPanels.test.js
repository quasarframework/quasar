import Vue from 'vue'
import QTabPanels from '@components/QTabPanels';

describe('QTabPanels', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTabPanels)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
