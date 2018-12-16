import Vue from 'vue'
import QNoSsr from '@components/QNoSsr';

describe('QNoSsr', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QNoSsr)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
