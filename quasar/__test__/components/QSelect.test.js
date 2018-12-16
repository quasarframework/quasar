import Vue from 'vue'
import QSelect from '@components/QSelect';

describe('QSelect', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSelect)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
