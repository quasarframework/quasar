import Vue from 'vue'
import QChatMessage from '@components/QChatMessage';

describe('QChatMessage', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QChatMessage)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
