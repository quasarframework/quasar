import Vue from 'vue'
import QSpinnerComment from '@components/QSpinnerComment';

describe('QSpinnerComment', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerComment)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
