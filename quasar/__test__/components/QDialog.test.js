import Vue from 'vue'
import QDialog from '@components/QDialog';

describe('QDialog', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QDialog)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
