import Vue from 'vue'
import QUploader from '@components/QUploader';

describe('QUploader', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QUploader)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
