import Vue from 'vue'
import QAvatar from '@components/QAvatar';

describe('QAvatar', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QAvatar)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
