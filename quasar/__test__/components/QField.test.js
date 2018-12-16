import Vue from 'vue'
import QField from '@components/QField';

describe('QField', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QField)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
