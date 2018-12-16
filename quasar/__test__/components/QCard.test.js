import Vue from 'vue'
import QCard from '@components/QCard';

describe('QCard', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCard)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
