import Vue from 'vue'
import QSpinnerHourglass from '@components/QSpinnerHourglass';

describe('QSpinnerHourglass', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerHourglass)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
