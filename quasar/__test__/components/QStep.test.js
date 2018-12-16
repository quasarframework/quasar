import Vue from 'vue'
import QStep from '@components/QStep';

describe('QStep', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QStep)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
