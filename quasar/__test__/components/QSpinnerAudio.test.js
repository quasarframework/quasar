import Vue from 'vue'
import QSpinnerAudio from '@components/QSpinnerAudio';

describe('QSpinnerAudio', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerAudio)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
