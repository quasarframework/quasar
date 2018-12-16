import Vue from 'vue'
import QVideo from '@components/QVideo';

describe('QVideo', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QVideo)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
