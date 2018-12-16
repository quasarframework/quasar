import Vue from 'vue'
import QCircularProgress from '@components/QCircularProgress';

describe('QCircularProgress', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCircularProgress)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
