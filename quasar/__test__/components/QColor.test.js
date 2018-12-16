import Vue from 'vue'
import QColor from '@components/QColor';

describe('QColor', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QColor)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
