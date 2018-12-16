import Vue from 'vue'
import QTimeline from '@components/QTimeline';

describe('QTimeline', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTimeline)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
