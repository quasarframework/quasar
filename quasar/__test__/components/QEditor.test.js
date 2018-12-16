import Vue from 'vue'
import QEditor from '@components/QEditor';

describe('QEditor', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QEditor)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
