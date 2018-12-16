import Vue from 'vue'
import QTimelineEntry from '@components/QTimelineEntry';

describe('QTimelineEntry', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTimelineEntry)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
