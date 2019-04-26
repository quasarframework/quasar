import { mouseEvents } from '../../mocks/'
import TouchSwipe from '@/directives/touch-swipe'
import { mount } from '@vue/test-utils'

describe('TouchSwipe provides correct direction', () => {
  let wrapper,
    isFired

  function testDirection (direction, touchStartEvent, touchMoveEvent, touchEndEvent) {
    wrapper.setMethods({
      onSwipe (e) {
        expect(e.direction).toBe(direction)
        isFired = true
      }
    })
    wrapper.trigger('touchstart', touchStartEvent)
    wrapper.trigger('touchmove', touchMoveEvent)
    wrapper.trigger('touchend', touchEndEvent)
    expect(isFired).toBe(true)
  }
  beforeAll(() => {
    wrapper = mount({ template: `<div v-touch-swipe="onSwipe" />`,
      directives: { TouchSwipe },
      methods: {onSwipe () {}}
    })
  })

  beforeEach(() => {
    isFired = false
  })

  test('returns left on left-swipe', () => {
    testDirection('left', mouseEvents.east, mouseEvents.middle, mouseEvents.west)
  })
  test('returns right on right-swipe', () => {
    testDirection('right', mouseEvents.west, mouseEvents.middle, mouseEvents.east)
  })
  test('returns up on up-swipe', () => {
    testDirection('up', mouseEvents.south, mouseEvents.middle, mouseEvents.north)
  })
  test('returns down on down-swipe', () => {
    testDirection('down', mouseEvents.north, mouseEvents.middle, mouseEvents.south)
  })
})
