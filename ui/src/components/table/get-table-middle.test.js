import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import getTableMiddle from './get-table-middle.js'

function mountMiddle(props, content) {
  return mount(
    defineComponent({
      setup: () => () => getTableMiddle(props, content)
    })
  )
}

describe('[getTableMiddle API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('wraps the content into a table inside a container', () => {
        const wrapper = mountMiddle({}, [h('tbody', h('tr', h('td', 'cell')))])

        const table = wrapper.get('table')

        expect(table.element.parentElement).toBe(wrapper.element)
        expect(wrapper.element.tagName).toBe('DIV')
        expect(table.classes()).toContain('q-table')
        expect(table.get('td').text()).toBe('cell')

        wrapper.unmount()
      })

      test('forwards the props to the container and not to the table', () => {
        const wrapper = mountMiddle(
          { class: 'my-class', style: 'height: 10px', role: 'presentation' },
          []
        )

        expect(wrapper.classes()).toContain('my-class')
        expect(wrapper.attributes('role')).toBe('presentation')
        expect(wrapper.get('table').classes()).not.toContain('my-class')
        expect(wrapper.element.style.height).toBe('10px')

        wrapper.unmount()
      })

      test('accepts no content', () => {
        const wrapper = mountMiddle({}, void 0)

        expect(wrapper.get('table').element.childNodes).toHaveLength(0)

        wrapper.unmount()
      })
    })
  })
})
