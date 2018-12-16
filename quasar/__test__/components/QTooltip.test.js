import Vue from 'vue'
import QTooltip from '@components/QTooltip';

describe('QTooltip', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTooltip)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
