import Vue from 'vue'
import QSpinnerFacebook from '@components/QSpinnerFacebook';

describe('QSpinnerFacebook', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerFacebook)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
