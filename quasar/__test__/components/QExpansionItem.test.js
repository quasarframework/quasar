import Vue from 'vue'
import QExpansionItem from '@components/QExpansionItem';

describe('QExpansionItem', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QExpansionItem)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
