import Vue from 'vue'
import QKnob from '@components/QKnob';

describe('QKnob', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QKnob)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
