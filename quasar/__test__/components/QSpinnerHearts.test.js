import Vue from 'vue'
import QSpinnerHearts from '@components/QSpinnerHearts';

describe('QSpinnerHearts', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerHearts)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
