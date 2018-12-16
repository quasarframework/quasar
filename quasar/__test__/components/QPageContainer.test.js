import Vue from 'vue'
import QPageContainer from '@components/QPageContainer';

describe('QPageContainer', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPageContainer)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
