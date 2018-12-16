import Vue from 'vue'
import QSlider from '@components/QSlider';

describe('QSlider', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSlider)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
