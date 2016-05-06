'use strict';

function swipeLeft(event) {
  if (event.type === 'panstart') {
    this.swipeItem.css('z-index', '');
  }

  var delta = Math.min(
    0,
    Math.max(
      -this.width,
      this.opened ? event.deltaX - this.width : event.deltaX
    )
  );

  if (event.type !== 'panend') {
    this.element.css('transform', 'translateX(' + delta + 'px)');
    return;
  }

  var changingState;

  if (!this.opened) {
    changingState = delta < -0.5 * this.width;
    this.element.velocity(
      {translateX: changingState ? [-this.width, delta] : [0, delta]},
      {duration: 250}
    );
  }
  else {
    changingState = delta > -0.5 * this.width;
    this.element.velocity(
      {translateX: changingState ? [0, delta] : [-this.width, delta]},
      {duration: 250}
    );
  }

  if (changingState) {
    this.opened = !this.opened;
    this.swipeItem.css('z-index', this.opened ? '1' : '');
  }
}

Vue.directive('swipe-item', {
  bind: function() {
    this.element = $(this.el);
    this.opened = false;
    this.swipeItem = this.element.siblings('.item-swipe');
    this.width = this.swipeItem.width();

    this.hammer = Hammer(this.el) // eslint-disable-line
      .set({direction: Hammer.DIRECTION_HORIZONTAL})
      .on('panstart pan panend', swipeLeft.bind(this));
  },
  unbind: function() {
    this.hammer.off('pan panend');
  }
});
