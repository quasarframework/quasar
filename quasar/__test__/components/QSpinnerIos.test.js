import Vue from 'vue'
import QSpinnerIos from '@components/QSpinnerIos';

describe('QSpinnerIos', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerIos)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
