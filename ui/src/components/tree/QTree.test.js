import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QTree from './QTree.js'

function getNodes() {
  return [
    {
      id: 'fruits',
      label: 'Fruits',
      children: [
        { id: 'apple', label: 'Apple' },
        { id: 'banana', label: 'Banana' }
      ]
    },
    { id: 'bread', label: 'Bread' }
  ]
}

function mountTree(props, options) {
  props ||= {}
  options ||= {}

  return mount(QTree, {
    props: {
      nodes: getNodes(),
      nodeKey: 'id',
      ...props
    },
    ...options
  })
}

function getNodeHeaders(wrapper) {
  return wrapper.findAll('.q-tree__node-header')
}

/**
 * The children of a collapsed node that was expanded before stay in
 * the DOM (hidden through v-show), so only the visible ones are of
 * interest here.
 *
 * The inline display is all that needs looking at, and it avoids
 * getComputedStyle, which is painfully slow with the whole stylesheet.
 */
function isShown(node) {
  let el = node.element

  while (el !== null && el !== document.body) {
    if (el.style.display === 'none') return false
    el = el.parentElement
  }

  return true
}

function getLabels(wrapper) {
  return wrapper
    .findAll('.q-tree__node-header-content')
    .filter(isShown)
    .map(node => node.text())
}

function getHeaderByLabel(wrapper, label) {
  return getNodeHeaders(wrapper).find(header => header.text() === label)
}

function getArrow(wrapper) {
  return wrapper.get('.q-tree__arrow')
}

function getTickboxes(wrapper) {
  return wrapper.findAll('.q-tree__tickbox')
}

describe('[QTree API]', () => {
  describe('[Props]', () => {
    describe('[(prop)nodes]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountTree()

        // only the roots are rendered until something gets expanded
        expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])

        await wrapper.setProps({ nodes: [{ id: 'milk', label: 'Milk' }] })

        expect(getLabels(wrapper)).toStrictEqual(['Milk'])
      })
    })

    describe('[(prop)node-key]', () => {
      test('type String has effect', () => {
        const propVal = 'uid'
        const wrapper = mountTree({
          nodeKey: propVal,
          nodes: [
            { uid: 'a', label: 'A', children: [{ uid: 'b', label: 'B' }] }
          ],
          expanded: ['a']
        })

        // the key is what every node gets addressed by
        expect(wrapper.vm.getNodeByKey('b')).toStrictEqual({
          uid: 'b',
          label: 'B'
        })
        expect(wrapper.vm.isExpanded('a')).toBe(true)
      })
    })

    describe('[(prop)label-key]', () => {
      test('type String has effect', () => {
        const propVal = 'name'
        const wrapper = mountTree({
          labelKey: propVal,
          nodes: [{ id: 'a', name: 'Named' }]
        })

        expect(getLabels(wrapper)).toStrictEqual(['Named'])
      })
    })

    describe('[(prop)children-key]', () => {
      test('type String has effect', () => {
        const propVal = 'kids'
        const wrapper = mountTree({
          childrenKey: propVal,
          nodes: [{ id: 'a', label: 'A', kids: [{ id: 'b', label: 'B' }] }],
          expanded: ['a']
        })

        expect(getLabels(wrapper)).toStrictEqual(['A', 'B'])
        // it is what makes a node a parent
        expect(wrapper.get('.q-tree__node').classes()).toContain(
          'q-tree__node--parent'
        )
      })
    })

    describe('[(prop)no-connectors]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTree()

        expect(wrapper.classes()).not.toContain('q-tree--no-connectors')

        await wrapper.setProps({ noConnectors: true })

        expect(wrapper.classes()).toContain('q-tree--no-connectors')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTree({ tickStrategy: 'strict' })

        expect(wrapper.classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ color: propVal })

        expect(wrapper.classes()).toContain(`text-${propVal}`)
        // the tickboxes fall back to it
        expect(
          wrapper.findComponent({ name: 'QCheckbox' }).props('color')
        ).toBe(propVal)
      })
    })

    describe('[(prop)control-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'accent'
        const wrapper = mountTree({ tickStrategy: 'strict', color: 'primary' })

        await wrapper.setProps({ controlColor: propVal })

        // it takes precedence over the general color for the controls
        expect(
          wrapper.findComponent({ name: 'QCheckbox' }).props('color')
        ).toBe(propVal)
        expect(wrapper.classes()).toContain('text-primary')
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTree()

        expect(
          wrapper.get('.q-tree__node-header-content').classes()
        ).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ textColor: propVal })

        expect(wrapper.get('.q-tree__node-header-content').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)selected-color]', () => {
      test('type String has effect', () => {
        const propVal = 'accent'
        const wrapper = mountTree({
          selected: 'bread',
          selectedColor: propVal,
          textColor: 'primary'
        })

        const contents = wrapper.findAll('.q-tree__node-header-content')

        // only the selected node uses it
        expect(contents[0].classes()).toContain('text-primary')
        expect(contents.at(-1).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTree()

        expect(wrapper.classes()).toContain('q-tree--standard')

        await wrapper.setProps({ dense: true })

        expect(wrapper.classes()).toContain('q-tree--dense')
        expect(wrapper.classes()).not.toContain('q-tree--standard')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTree()

        expect(wrapper.classes()).not.toContain('q-tree--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-tree--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountTree({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-tree--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-tree--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'arrow_right'
        const wrapper = mountTree()

        const defaultIcon = getArrow(wrapper).text()
        expect(defaultIcon).not.toBe(propVal)

        await wrapper.setProps({ icon: propVal })

        expect(getArrow(wrapper).text()).toBe(propVal)
      })
    })

    describe('[(prop)tick-strategy]', () => {
      test('value "none" has effect', () => {
        const wrapper = mountTree({
          tickStrategy: 'none',
          expanded: ['fruits']
        })

        expect(getTickboxes(wrapper)).toHaveLength(0)
      })

      test('value "strict" has effect', async () => {
        const wrapper = mountTree({
          tickStrategy: 'strict',
          expanded: ['fruits'],
          ticked: [],
          'onUpdate:ticked': () => {}
        })

        // every node can be ticked on its own
        expect(getTickboxes(wrapper)).toHaveLength(4)

        await wrapper
          .findComponent({ name: 'QCheckbox' })
          .get('.q-checkbox__inner')
          .trigger('click')

        // ...without dragging its children along
        expect(wrapper.emitted('update:ticked')).toStrictEqual([[['fruits']]])
      })

      test('value "leaf" has effect', async () => {
        const wrapper = mountTree({
          tickStrategy: 'leaf',
          expanded: ['fruits'],
          ticked: [],
          'onUpdate:ticked': () => {}
        })

        expect(getTickboxes(wrapper)).toHaveLength(4)

        await wrapper
          .findComponent({ name: 'QCheckbox' })
          .get('.q-checkbox__inner')
          .trigger('click')

        // ticking a parent ticks every leaf under it
        expect(wrapper.emitted('update:ticked')[0][0]).toStrictEqual([
          'apple',
          'banana'
        ])
      })

      test('value "leaf-filtered" has effect', async () => {
        const wrapper = mountTree({
          tickStrategy: 'leaf-filtered',
          expanded: ['fruits'],
          filter: 'Apple',
          ticked: [],
          'onUpdate:ticked': () => {}
        })

        await wrapper
          .findComponent({ name: 'QCheckbox' })
          .get('.q-checkbox__inner')
          .trigger('click')

        // only the leaves matching the filter get ticked
        expect(wrapper.emitted('update:ticked')[0][0]).toStrictEqual(['apple'])
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QTree.props.tickStrategy

        expect(validator(defaultValue)).toBe(true)
        expect(validator('leaf-filtered')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)ticked]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountTree({
          tickStrategy: 'strict',
          ticked: ['bread'],
          'onUpdate:ticked': () => {}
        })

        expect(wrapper.vm.isTicked('bread')).toBe(true)
        expect(wrapper.vm.isTicked('fruits')).toBe(false)

        await wrapper.setProps({ ticked: ['fruits'] })

        expect(wrapper.vm.isTicked('fruits')).toBe(true)
        expect(wrapper.vm.isTicked('bread')).toBe(false)
      })
    })

    describe('[(prop)expanded]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountTree({
          expanded: [],
          'onUpdate:expanded': () => {}
        })

        expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])

        await wrapper.setProps({ expanded: ['fruits'] })

        expect(getLabels(wrapper)).toStrictEqual([
          'Fruits',
          'Apple',
          'Banana',
          'Bread'
        ])
      })
    })

    describe('[(prop)selected]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountTree({
          selected: null,
          'onUpdate:selected': () => {}
        })

        expect(wrapper.find('.q-tree__node--selected').exists()).toBe(false)

        await wrapper.setProps({ selected: 'bread' })

        expect(getHeaderByLabel(wrapper, 'Bread').classes()).toContain(
          'q-tree__node--selected'
        )
      })
    })

    describe('[(prop)no-selection-unset]', () => {
      test('type Boolean has effect', async () => {
        const props = {
          selected: 'bread',
          'onUpdate:selected': () => {}
        }

        const wrapper = mountTree(props)
        await getHeaderByLabel(wrapper, 'Bread').trigger('click')

        // clicking the selected node normally clears the selection
        expect(wrapper.emitted('update:selected')).toStrictEqual([[null]])

        const keptWrapper = mountTree({ ...props, noSelectionUnset: true })
        await getHeaderByLabel(keptWrapper, 'Bread').trigger('click')

        expect(keptWrapper.emitted('update:selected')).toBeUndefined()
      })
    })

    describe('[(prop)default-expand-all]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountTree({ defaultExpandAll: true })

        expect(getLabels(wrapper)).toStrictEqual([
          'Fruits',
          'Apple',
          'Banana',
          'Bread'
        ])
      })
    })

    describe('[(prop)accordion]', () => {
      test('type Boolean has effect', async () => {
        const nodes = [
          { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }] },
          { id: 'b', label: 'B', children: [{ id: 'b1', label: 'B1' }] }
        ]

        const wrapper = mountTree({ nodes, accordion: true })

        wrapper.vm.setExpanded('a', true)
        await nextTick()
        expect(wrapper.vm.isExpanded('a')).toBe(true)

        wrapper.vm.setExpanded('b', true)
        await nextTick()

        // expanding a sibling collapses the previous one
        expect(wrapper.vm.isExpanded('b')).toBe(true)
        expect(wrapper.vm.isExpanded('a')).toBe(false)
      })
    })

    describe('[(prop)no-transition]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTree({ expanded: ['fruits'] })

        expect(
          wrapper.findComponent({ name: 'QSlideTransition' }).exists()
        ).toBe(true)

        await wrapper.setProps({ noTransition: true })

        // the children are rendered straight away, with no animation
        expect(
          wrapper.findComponent({ name: 'QSlideTransition' }).exists()
        ).toBe(false)
        expect(wrapper.find('.q-tree__node-collapsible').exists()).toBe(true)
        expect(getLabels(wrapper)).toContain('Apple')
      })
    })

    describe('[(prop)filter]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTree({ expanded: ['fruits'] })

        await wrapper.setProps({ filter: 'app' })

        // the match and its ancestors are kept, the rest is dropped
        expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Apple'])
      })
    })

    describe('[(prop)filter-method]', () => {
      test('type Function has effect', async () => {
        const propVal = (node, filter) => node.id === filter
        const wrapper = mountTree({
          expanded: ['fruits'],
          filter: 'banana',
          filterMethod: propVal
        })

        // the custom method matches on the id instead of the label
        expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Banana'])

        await wrapper.setProps({ filter: 'Banana' })

        expect(getLabels(wrapper)).toStrictEqual([])
      })
    })

    describe('[(prop)duration]', () => {
      test('type Number has effect', async () => {
        const propVal = 1000
        const wrapper = mountTree({ expanded: ['fruits'] })

        await wrapper.setProps({ duration: propVal })

        expect(
          wrapper.findComponent({ name: 'QSlideTransition' }).props('duration')
        ).toBe(propVal)
      })
    })

    describe('[(prop)no-nodes-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Nothing here'
        const wrapper = mountTree({ nodes: [] })

        expect(wrapper.text()).toBe('No nodes available')

        await wrapper.setProps({ noNodesLabel: propVal })

        expect(wrapper.text()).toBe(propVal)
      })
    })

    describe('[(prop)no-results-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Nothing matches'
        const wrapper = mountTree({ filter: 'nothing-matches-this' })

        expect(wrapper.text()).toBe('No matching nodes found')

        await wrapper.setProps({ noResultsLabel: propVal })

        expect(wrapper.text()).toBe(propVal)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default-header]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTree(
          {},
          {
            slots: {
              'default-header': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        // it takes over the header of every node
        expect(getLabels(wrapper)).toStrictEqual([slotContent, slotContent])

        expect(slotScope).toStrictEqual({
          tree: expect.any(Object),
          node: expect.any(Object),
          key: expect.any(String),
          color: void 0,
          dark: false,
          expanded: expect.any(Boolean),
          ticked: expect.any(Boolean)
        })
        expect(slotScope.key).toBe('bread')
      })
    })

    describe('[(slot)header-[name]]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountTree(
          {
            nodes: [
              { id: 'a', label: 'A', header: 'custom' },
              { id: 'b', label: 'B' }
            ]
          },
          {
            slots: {
              'header-custom': () => slotContent,
              'default-header': () => 'default-slot-content'
            }
          }
        )

        // the node picks its header slot by name, the rest fall back
        expect(getLabels(wrapper)).toStrictEqual([
          slotContent,
          'default-slot-content'
        ])
      })
    })

    describe('[(slot)default-body]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTree(
          { expanded: ['fruits'] },
          {
            slots: {
              'default-body': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-tree__node-body').text()).toBe(slotContent)

        expect(slotScope).toStrictEqual({
          tree: expect.any(Object),
          node: expect.any(Object),
          key: expect.any(String),
          color: void 0,
          dark: false,
          expanded: expect.any(Boolean),
          ticked: expect.any(Boolean)
        })
      })
    })

    describe('[(slot)body-[name]]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountTree(
          {
            nodes: [
              {
                id: 'a',
                label: 'A',
                body: 'custom',
                children: [{ id: 'a1', label: 'A1' }]
              }
            ],
            expanded: ['a']
          },
          {
            slots: {
              'body-custom': () => slotContent,
              'default-body': () => 'default-slot-content'
            }
          }
        )

        expect(wrapper.get('.q-tree__node-body').text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:expanded]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree({
          expanded: [],
          'onUpdate:expanded': () => {}
        })

        await getArrow(wrapper).trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:expanded')
        expect(eventList['update:expanded']).toHaveLength(1)

        const [keys] = eventList['update:expanded'][0]
        expect(keys).toStrictEqual(['fruits'])
      })
    })

    describe('[(event)lazy-load]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree({
          nodes: [{ id: 'lazy', label: 'Lazy', lazy: true }],
          onLazyLoad: () => {}
        })

        wrapper.vm.setExpanded('lazy', true)
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('lazyLoad')
        expect(eventList.lazyLoad).toHaveLength(1)

        const [details] = eventList.lazyLoad[0]
        expect(details).toStrictEqual({
          node: expect.any(Object),
          key: 'lazy',
          done: expect.any(Function),
          fail: expect.any(Function)
        })

        // it shows a spinner until the children arrive
        expect(wrapper.find('.q-tree__spinner').exists()).toBe(true)

        details.done([{ id: 'child', label: 'Child' }])
        await flushPromises()

        expect(wrapper.find('.q-tree__spinner').exists()).toBe(false)
        expect(getLabels(wrapper)).toStrictEqual(['Lazy', 'Child'])
      })
    })

    describe('[(event)update:ticked]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree({
          tickStrategy: 'strict',
          ticked: [],
          'onUpdate:ticked': () => {}
        })

        await wrapper
          .findComponent({ name: 'QCheckbox' })
          .get('.q-checkbox__inner')
          .trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:ticked')
        expect(eventList['update:ticked']).toHaveLength(1)

        const [keys] = eventList['update:ticked'][0]
        expect(keys).toStrictEqual(['fruits'])
      })
    })

    describe('[(event)update:selected]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree({
          selected: null,
          'onUpdate:selected': () => {}
        })

        await getHeaderByLabel(wrapper, 'Bread').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:selected')
        expect(eventList['update:selected']).toHaveLength(1)

        const [key] = eventList['update:selected'][0]
        expect(key).toBe('bread')
      })
    })

    describe('[(event)after-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree()

        wrapper.vm.setExpanded('fruits', true)
        await flushPromises()

        // the transition reports it once it has finished
        wrapper.findComponent({ name: 'QSlideTransition' }).vm.$emit('show')
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('afterShow')
        expect(eventList.afterShow).toHaveLength(1)
        expect(eventList.afterShow[0]).toHaveLength(0)
      })
    })

    describe('[(event)after-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountTree({ expanded: ['fruits'] })

        wrapper.findComponent({ name: 'QSlideTransition' }).vm.$emit('hide')
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('afterHide')
        expect(eventList.afterHide).toHaveLength(1)
        expect(eventList.afterHide[0]).toHaveLength(0)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)getNodeByKey]', () => {
      test('should be callable', () => {
        const wrapper = mountTree()

        // it looks through the whole tree, not just the roots
        expect(wrapper.vm.getNodeByKey('banana')).toStrictEqual({
          id: 'banana',
          label: 'Banana'
        })
        expect(wrapper.vm.getNodeByKey('nowhere')).toBeUndefined()
      })
    })

    describe('[(method)getTickedNodes]', () => {
      test('should be callable', () => {
        const wrapper = mountTree({
          tickStrategy: 'strict',
          ticked: ['banana', 'bread']
        })

        expect(wrapper.vm.getTickedNodes()).toStrictEqual([
          { id: 'banana', label: 'Banana' },
          { id: 'bread', label: 'Bread' }
        ])
      })
    })

    describe('[(method)getExpandedNodes]', () => {
      test('should be callable', () => {
        const wrapper = mountTree({ expanded: ['fruits'] })

        expect(
          wrapper.vm.getExpandedNodes().map(node => node.id)
        ).toStrictEqual(['fruits'])
      })
    })

    describe('[(method)isExpanded]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree()

        expect(wrapper.vm.isExpanded('fruits')).toBe(false)

        wrapper.vm.setExpanded('fruits', true)
        await nextTick()

        expect(wrapper.vm.isExpanded('fruits')).toBe(true)
      })
    })

    describe('[(method)expandAll]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree()

        expect(wrapper.vm.expandAll()).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.isExpanded('fruits')).toBe(true)
        expect(getLabels(wrapper)).toContain('Apple')
      })
    })

    describe('[(method)collapseAll]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree({ defaultExpandAll: true })

        expect(wrapper.vm.collapseAll()).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.isExpanded('fruits')).toBe(false)
        expect(wrapper.vm.getExpandedNodes()).toStrictEqual([])
      })
    })

    describe('[(method)setExpanded]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree()

        expect(wrapper.vm.setExpanded('fruits', true)).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.isExpanded('fruits')).toBe(true)

        wrapper.vm.setExpanded('fruits', false)
        await nextTick()

        expect(wrapper.vm.isExpanded('fruits')).toBe(false)
      })
    })

    describe('[(method)isTicked]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree({ tickStrategy: 'strict' })

        expect(wrapper.vm.isTicked('bread')).toBe(false)

        wrapper.vm.setTicked(['bread'], true)
        await nextTick()

        expect(wrapper.vm.isTicked('bread')).toBe(true)
      })
    })

    describe('[(method)setTicked]', () => {
      test('should be callable', async () => {
        const wrapper = mountTree({ tickStrategy: 'strict' })

        expect(wrapper.vm.setTicked(['bread', 'banana'], true)).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.getTickedNodes().map(node => node.id)).toStrictEqual([
          'bread',
          'banana'
        ])

        wrapper.vm.setTicked(['bread'], false)
        await nextTick()

        expect(wrapper.vm.getTickedNodes().map(node => node.id)).toStrictEqual([
          'banana'
        ])
      })
    })
  })

  describe('[Generic]', () => {
    test('renders a collapsed subtree only after its first expansion', async () => {
      const wrapper = mountTree()

      // never-expanded nodes have no collapsible content in the DOM
      expect(wrapper.find('.q-tree__node-collapsible').exists()).toBe(false)

      wrapper.vm.setExpanded('fruits', true)
      await nextTick()

      expect(getLabels(wrapper)).toStrictEqual([
        'Fruits',
        'Apple',
        'Banana',
        'Bread'
      ])

      wrapper.vm.setExpanded('fruits', false)
      await nextTick()

      expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])
      // once revealed it is kept alive (v-show) so collapsing can animate
      expect(wrapper.findAll('.q-tree__node-collapsible')).toHaveLength(1)
    })

    test('drops the collapsible of collapsed nodes with no-transition', async () => {
      const wrapper = mountTree({ noTransition: true })

      wrapper.vm.setExpanded('fruits', true)
      await nextTick()

      expect(getLabels(wrapper)).toStrictEqual([
        'Fruits',
        'Apple',
        'Banana',
        'Bread'
      ])

      wrapper.vm.setExpanded('fruits', false)
      await nextTick()

      expect(wrapper.find('.q-tree__node-collapsible').exists()).toBe(false)
    })
  })

  describe('[Accessibility]', () => {
    // binding a selection makes leaf nodes focusable "links" too,
    // like in real keyboard-accessible usage
    function mountNavTree(props) {
      return mountTree({ selected: null, ...props })
    }

    // parent headers also contain the arrow icon's ligature text,
    // so an exact header.text() match only works for leaves
    function getHeader(wrapper, label) {
      return getNodeHeaders(wrapper).find(
        header => header.get('.q-tree__node-header-content').text() === label
      )
    }

    function keydown(header, keyCode) {
      return header.trigger('keydown', { keyCode })
    }

    test('keeps a single roving Tab stop', async () => {
      const wrapper = mountNavTree()

      const fruits = getHeader(wrapper, 'Fruits')
      const bread = getHeader(wrapper, 'Bread')

      expect(fruits.attributes('tabindex')).toBe('0')
      expect(bread.attributes('tabindex')).toBe('-1')

      await bread.trigger('focus')

      expect(fruits.attributes('tabindex')).toBe('-1')
      expect(bread.attributes('tabindex')).toBe('0')
    })

    test('steps through the nodes with ArrowDown/ArrowUp', async () => {
      const wrapper = mountNavTree({ defaultExpandAll: true })

      await keydown(getHeader(wrapper, 'Fruits'), 40)
      expect(document.activeElement).toBe(getHeader(wrapper, 'Apple').element)

      await keydown(getHeader(wrapper, 'Apple'), 40)
      expect(document.activeElement).toBe(getHeader(wrapper, 'Banana').element)

      await keydown(getHeader(wrapper, 'Banana'), 38)
      expect(document.activeElement).toBe(getHeader(wrapper, 'Apple').element)
    })

    test('skips the children of collapsed nodes', async () => {
      const wrapper = mountNavTree()

      await keydown(getHeader(wrapper, 'Fruits'), 40)

      expect(document.activeElement).toBe(getHeader(wrapper, 'Bread').element)
    })

    test('jumps to the boundary nodes with Home/End', async () => {
      const wrapper = mountNavTree({ defaultExpandAll: true })

      await keydown(getHeader(wrapper, 'Apple'), 35)
      expect(document.activeElement).toBe(getHeader(wrapper, 'Bread').element)

      await keydown(getHeader(wrapper, 'Bread'), 36)
      expect(document.activeElement).toBe(getHeader(wrapper, 'Fruits').element)
    })

    test('expands a collapsed parent node with ArrowRight', async () => {
      const wrapper = mountNavTree()

      expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])

      const fruits = getHeader(wrapper, 'Fruits')
      fruits.element.focus()
      await keydown(fruits, 39)

      expect(getLabels(wrapper)).toStrictEqual([
        'Fruits',
        'Apple',
        'Banana',
        'Bread'
      ])
      // focus stays put; a second ArrowRight moves into the children
      expect(document.activeElement).toBe(fruits.element)
    })

    test('moves into an expanded parent node with ArrowRight', async () => {
      const wrapper = mountNavTree({ defaultExpandAll: true })

      await keydown(getHeader(wrapper, 'Fruits'), 39)

      expect(document.activeElement).toBe(getHeader(wrapper, 'Apple').element)
    })

    test('leaves leaf nodes unaffected by ArrowRight', async () => {
      const wrapper = mountNavTree()

      const bread = getHeader(wrapper, 'Bread')
      bread.element.focus()
      await keydown(bread, 39)

      expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])
      expect(document.activeElement).toBe(bread.element)
    })

    test('collapses an expanded parent node with ArrowLeft', async () => {
      const wrapper = mountNavTree({ defaultExpandAll: true })

      await keydown(getHeader(wrapper, 'Fruits'), 37)

      expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])
    })

    test('moves to the parent node with ArrowLeft on a child', async () => {
      const wrapper = mountNavTree({ defaultExpandAll: true })

      await keydown(getHeader(wrapper, 'Apple'), 37)

      expect(document.activeElement).toBe(getHeader(wrapper, 'Fruits').element)
      // the parent is left expanded; another ArrowLeft collapses it
      expect(getLabels(wrapper)).toStrictEqual([
        'Fruits',
        'Apple',
        'Banana',
        'Bread'
      ])
    })

    test('keeps the tickboxes out of the Tab order', () => {
      const wrapper = mountNavTree({ tickStrategy: 'strict' })

      for (const tickbox of getTickboxes(wrapper)) {
        expect(tickbox.attributes('tabindex')).toBe('-1')
        expect(tickbox.attributes('aria-hidden')).toBe('true')
      }
    })

    test('does not trap Tab on a tickbox', () => {
      const wrapper = mountNavTree({ tickStrategy: 'strict' })

      const event = new KeyboardEvent('keydown', {
        cancelable: true,
        bubbles: true
      })
      Object.defineProperty(event, 'keyCode', { value: 9 })

      getTickboxes(wrapper)[0].element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })

    test('toggles ticking with Space on a tickable node', async () => {
      const wrapper = mountNavTree({
        tickStrategy: 'strict',
        ticked: [],
        'onUpdate:ticked': () => {}
      })

      await keydown(getHeader(wrapper, 'Fruits'), 32)

      expect(wrapper.emitted('update:ticked')).toStrictEqual([[['fruits']]])
      // ticking replaces the expansion toggle
      expect(getLabels(wrapper)).toStrictEqual(['Fruits', 'Bread'])
    })

    test('keeps Space as the expansion toggle on non-tickable nodes', async () => {
      const wrapper = mountNavTree()

      await keydown(getHeader(wrapper, 'Fruits'), 32)

      expect(getLabels(wrapper)).toStrictEqual([
        'Fruits',
        'Apple',
        'Banana',
        'Bread'
      ])
    })

    test('exposes the ticked state', async () => {
      const wrapper = mountNavTree({
        tickStrategy: 'leaf',
        ticked: ['apple'],
        'onUpdate:ticked': () => {},
        defaultExpandAll: true
      })

      expect(getHeader(wrapper, 'Fruits').attributes('aria-checked')).toBe(
        'mixed'
      )
      expect(getHeader(wrapper, 'Apple').attributes('aria-checked')).toBe(
        'true'
      )
      expect(getHeader(wrapper, 'Banana').attributes('aria-checked')).toBe(
        'false'
      )

      await wrapper.setProps({ ticked: ['apple', 'banana'] })

      expect(getHeader(wrapper, 'Fruits').attributes('aria-checked')).toBe(
        'true'
      )
    })

    test('omits aria-checked without a tick strategy', () => {
      const wrapper = mountNavTree()

      expect(
        getHeader(wrapper, 'Fruits').attributes('aria-checked')
      ).toBeUndefined()
    })

    test('exposes the expansion and selection state', async () => {
      const wrapper = mountNavTree()

      const fruits = getHeader(wrapper, 'Fruits')
      const bread = getHeader(wrapper, 'Bread')

      expect(fruits.attributes('aria-expanded')).toBe('false')
      expect(fruits.attributes('aria-selected')).toBe('false')
      expect(bread.attributes('aria-expanded')).toBeUndefined()
      expect(bread.attributes('aria-selected')).toBe('false')

      await keydown(fruits, 39)

      expect(fruits.attributes('aria-expanded')).toBe('true')
    })
  })
})
