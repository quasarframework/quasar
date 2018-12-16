import Vue from 'vue'
import QBreadcrumbsEl from '@components/QBreadcrumbsEl';

describe('QBreadcrumbsEl', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBreadcrumbsEl)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
