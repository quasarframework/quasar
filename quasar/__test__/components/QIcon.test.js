import Vue from 'vue'
import QIcon from '@components/QIcon';

describe('QIcon', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QIcon)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
