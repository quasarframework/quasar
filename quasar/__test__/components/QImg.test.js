import Vue from 'vue'
import QImg from '@components/QImg';

describe('QImg', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QImg)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
