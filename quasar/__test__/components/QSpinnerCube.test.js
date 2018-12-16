import Vue from 'vue'
import QSpinnerCube from '@components/QSpinnerCube';

describe('QSpinnerCube', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerCube)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
