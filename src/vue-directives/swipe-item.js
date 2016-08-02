import $ from 'jquery'
import Hammer from 'hammerjs'

function swipeLeft (self) {
  return (event) => {
    if (event.type === 'panstart') {
      self.swipeItem.css('z-index', '')
    }

    var delta = Math.min(
      0,
      Math.max(
        -self.width,
        self.opened ? event.deltaX - self.width : event.deltaX
      )
    )

    if (event.type !== 'panend') {
      self.element.css('transform', 'translateX(' + delta + 'px)')
      return
    }

    let changingState

    if (!self.opened) {
      changingState = delta < -0.5 * self.width
      self.element.velocity(
        {translateX: changingState ? [-self.width, delta] : [0, delta]},
        {duration: 250}
      )
    }
    else {
      changingState = delta > -0.5 * this.width
      self.element.velocity(
        {translateX: changingState ? [0, delta] : [-self.width, delta]},
        {duration: 250}
      )
    }

    if (changingState) {
      self.opened = !self.opened
      self.swipeItem.css('z-index', self.opened ? '1' : '')
    }
  }
}

export default {
  bind () {
    this.element = $(this.el)
    this.opened = false
    this.swipeItem = this.element.siblings('.item-swipe')
    this.width = this.swipeItem.width()

    this.hammer = Hammer(this.el) // eslint-disable-line
      .set({direction: Hammer.DIRECTION_HORIZONTAL})
      .on('panstart pan panend', swipeLeft(this))
  },
  unbind () {
    this.hammer.off('panstart pan panend')
  }
}
