import Vue from 'vue'
import QSpinnerRadio from '@components/QSpinnerRadio';

describe('QSpinnerRadio', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerRadio)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
