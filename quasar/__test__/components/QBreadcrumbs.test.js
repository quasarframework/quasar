import Vue from 'vue'
import QBreadcrumbs from '@components/QBreadcrumbs';

describe('QBreadcrumbs', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBreadcrumbs)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
