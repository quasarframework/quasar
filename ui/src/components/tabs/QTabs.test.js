import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick } from 'vue'

import QTab from './QTab.js'
import QTabs from './QTabs.js'

afterEach(() => {
  vi.restoreAllMocks()
})

const defaultTabList = [
  { name: 'home', label: 'Home', icon: 'map' },
  { name: 'other', label: 'Other' }
]

function mountTabs(props = {}, tabList = defaultTabList) {
  return mount(QTabs, {
    props: {
      modelValue: 'home',
      // QTabs only emits when a listener is actually attached
      'onUpdate:modelValue': () => {},
      ...props
    },
    slots: {
      default: () => tabList.map(tabProps => h(QTab, tabProps))
    }
  })
}

function getContent(wrapper) {
  return wrapper.get('.q-tabs__content')
}

function getTabs(wrapper) {
  return wrapper.findAll('.q-tab')
}

function getActiveTab(wrapper) {
  return wrapper.get('.q-tab--active')
}

function getIndicators(wrapper) {
  return wrapper.findAll('.q-tab__indicator')
}

function getLeftArrow(wrapper) {
  return wrapper.get('.q-tabs__arrow--left')
}

function getRightArrow(wrapper) {
  return wrapper.get('.q-tabs__arrow--right')
}

/**
 * jsdom reports a zero size for every element, which would make QTabs
 * believe that it is narrower than its breakpoint; the container size is
 * reported through the QResizeObserver that QTabs renders.
 */
async function setContainerSize(wrapper, { width = 1000, height = 400 } = {}) {
  // let the size recalculation scheduled by the tab registration
  // run first, otherwise it would overwrite this one
  await nextTick()

  wrapper.getComponent({ name: 'QResizeObserver' }).vm.$emit('resize', {
    width,
    height
  })
  await nextTick()
}

describe('[QTabs API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountTabs({ modelValue: 20 }, [
          { name: propVal, label: 'First' },
          { name: 20, label: 'Second' }
        ])

        expect(getActiveTab(wrapper).get('.q-tab__label').text()).toBe('Second')

        await wrapper.setProps({ modelValue: propVal })

        expect(getActiveTab(wrapper).get('.q-tab__label').text()).toBe('First')
      })

      test('type String has effect', async () => {
        const wrapper = mountTabs()

        expect(getActiveTab(wrapper).get('.q-tab__label').text()).toBe('Home')

        await wrapper.setProps({ modelValue: 'other' })

        expect(getActiveTab(wrapper).get('.q-tab__label').text()).toBe('Other')
      })

      test('type null has effect', async () => {
        const wrapper = mountTabs()

        await wrapper.setProps({ modelValue: null })

        expect(wrapper.find('.q-tab--active').exists()).toBe(false)
        expect(
          getTabs(wrapper).every(tab =>
            tab.classes().includes('q-tab--inactive')
          )
        ).toBe(true)
      })

      test('type undefined has effect', async () => {
        const wrapper = mountTabs()

        await wrapper.setProps({ modelValue: void 0 })

        expect(wrapper.find('.q-tab--active').exists()).toBe(false)
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).toContain('q-tabs--horizontal')
        expect(wrapper.attributes('aria-orientation')).toBe('horizontal')

        await wrapper.setProps({ vertical: true })

        expect(wrapper.classes()).toContain('q-tabs--vertical')
        expect(wrapper.classes()).not.toContain('q-tabs--horizontal')
        expect(wrapper.attributes('aria-orientation')).toBe('vertical')

        // the indicator switches to the vertical edge as well
        expect(getIndicators(wrapper)[0].classes()).toContain('absolute-right')
      })
    })

    describe('[(prop)outside-arrows]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).toContain('q-tabs__arrows--inside')

        await wrapper.setProps({ outsideArrows: true })

        expect(wrapper.classes()).toContain('q-tabs__arrows--outside')
        expect(wrapper.classes()).not.toContain('q-tabs__arrows--inside')
      })
    })

    describe('[(prop)mobile-arrows]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).toContain('q-tabs--mobile-without-arrows')

        await wrapper.setProps({ mobileArrows: true })

        expect(wrapper.classes()).toContain('q-tabs--mobile-with-arrows')
        expect(wrapper.classes()).not.toContain('q-tabs--mobile-without-arrows')
      })
    })

    describe('[(prop)align]', () => {
      async function testAlign(propVal) {
        const wrapper = mountTabs({ align: propVal })

        // a container wider than the breakpoint is what allows
        // the requested alignment to be used
        await setContainerSize(wrapper)

        expect(getContent(wrapper).classes()).toContain(
          `q-tabs__content--align-${propVal}`
        )
      }

      test('value "left" has effect', async () => {
        await testAlign('left')
      })

      test('value "center" has effect', async () => {
        await testAlign('center')
      })

      test('value "right" has effect', async () => {
        await testAlign('right')
      })

      test('value "justify" has effect', async () => {
        await testAlign('justify')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QTabs.props.align

        expect(validator(defaultValue)).toBe(true)
        expect(validator('left')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)breakpoint]', () => {
      test('type Number has effect', async () => {
        const propVal = 600
        const wrapper = mountTabs({ align: 'left', breakpoint: propVal })

        await setContainerSize(wrapper, { width: propVal - 1 })

        // below the breakpoint the tabs get justified, no matter the alignment
        expect(getContent(wrapper).classes()).toContain(
          'q-tabs__content--align-justify'
        )

        await setContainerSize(wrapper, { width: propVal })

        expect(getContent(wrapper).classes()).toContain(
          'q-tabs__content--align-left'
        )
      })

      test('type String has effect', async () => {
        const wrapper = mountTabs({ align: 'left', breakpoint: '600' })

        await setContainerSize(wrapper, { width: 599 })

        expect(getContent(wrapper).classes()).toContain(
          'q-tabs__content--align-justify'
        )

        await setContainerSize(wrapper, { width: 600 })

        expect(getContent(wrapper).classes()).toContain(
          'q-tabs__content--align-left'
        )
      })
    })

    describe('[(prop)active-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTabs()

        expect(getActiveTab(wrapper).classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ activeColor: propVal })

        expect(getActiveTab(wrapper).classes()).toContain(`text-${propVal}`)
        // only the active tab is colored
        expect(getTabs(wrapper)[1].classes()).not.toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)active-bg-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTabs()

        expect(getActiveTab(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ activeBgColor: propVal })

        expect(getActiveTab(wrapper).classes()).toContain(`bg-${propVal}`)
        expect(getTabs(wrapper)[1].classes()).not.toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)indicator-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTabs()

        expect(getIndicators(wrapper)[0].classes()).not.toContain(
          `text-${propVal}`
        )

        await wrapper.setProps({ indicatorColor: propVal })

        // every tab indicator gets the color
        expect(
          getIndicators(wrapper).every(indicator =>
            indicator.classes().includes(`text-${propVal}`)
          )
        ).toBe(true)
      })
    })

    describe('[(prop)content-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTabs()

        expect(getContent(wrapper).classes()).not.toContain(propVal)

        await wrapper.setProps({ contentClass: propVal })

        expect(getContent(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-active-class'
        const wrapper = mountTabs()

        expect(getActiveTab(wrapper).classes()).not.toContain(propVal)

        await wrapper.setProps({ activeClass: propVal })

        expect(getActiveTab(wrapper).classes()).toContain(propVal)
        expect(getTabs(wrapper)[1].classes()).not.toContain(propVal)
      })
    })

    describe('[(prop)left-icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'arrow_left'
        const wrapper = mountTabs()

        const defaultIcon = getLeftArrow(wrapper).text()
        expect(defaultIcon).not.toBe(propVal)

        await wrapper.setProps({ leftIcon: propVal })

        expect(getLeftArrow(wrapper).text()).toBe(propVal)
        expect(getRightArrow(wrapper).text()).not.toBe(propVal)
      })
    })

    describe('[(prop)right-icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'arrow_right'
        const wrapper = mountTabs()

        expect(getRightArrow(wrapper).text()).not.toBe(propVal)

        await wrapper.setProps({ rightIcon: propVal })

        expect(getRightArrow(wrapper).text()).toBe(propVal)
        expect(getLeftArrow(wrapper).text()).not.toBe(propVal)
      })
    })

    describe('[(prop)stretch]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).not.toContain('self-stretch')

        await wrapper.setProps({ stretch: true })

        expect(wrapper.classes()).toContain('self-stretch')
      })
    })

    describe('[(prop)shrink]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).not.toContain('col-shrink')

        await wrapper.setProps({ shrink: true })

        expect(wrapper.classes()).toContain('col-shrink')
      })
    })

    describe('[(prop)switch-indicator]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(getIndicators(wrapper)[0].classes()).toContain('absolute-bottom')

        await wrapper.setProps({ switchIndicator: true })

        expect(getIndicators(wrapper)[0].classes()).toContain('absolute-top')

        await wrapper.setProps({ vertical: true })

        expect(getIndicators(wrapper)[0].classes()).toContain('absolute-left')
      })
    })

    describe('[(prop)narrow-indicator]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        // by default the indicator spans the whole tab
        expect(
          wrapper.find('.q-tab__content > .q-tab__indicator').exists()
        ).toBe(false)

        await wrapper.setProps({ narrowIndicator: true })

        expect(
          wrapper.find('.q-tab__content > .q-tab__indicator').exists()
        ).toBe(true)
      })
    })

    describe('[(prop)inline-label]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()
        const tabContent = wrapper.get('.q-tab__content')

        expect(tabContent.classes()).toContain('column')
        expect(getActiveTab(wrapper).classes()).toContain('q-tab--full')

        await wrapper.setProps({ inlineLabel: true })

        expect(tabContent.classes()).toContain('q-tab__content--inline')
        expect(tabContent.classes()).not.toContain('column')
        expect(getActiveTab(wrapper).classes()).not.toContain('q-tab--full')
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(getActiveTab(wrapper).classes()).not.toContain('q-tab--no-caps')

        await wrapper.setProps({ noCaps: true })

        expect(
          getTabs(wrapper).every(tab =>
            tab.classes().includes('q-tab--no-caps')
          )
        ).toBe(true)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTabs()

        expect(wrapper.classes()).not.toContain('q-tabs--dense')

        await wrapper.setProps({ dense: true })

        expect(wrapper.classes()).toContain('q-tabs--dense')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QTabs, {
          slots: { default: () => slotContent }
        })

        expect(getContent(wrapper).text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountTabs()

        await getTabs(wrapper)[1].trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('other')
      })

      test('is not emitting for the already selected tab', async () => {
        const wrapper = mountTabs()

        await getTabs(wrapper)[0].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })
  })
})
