'use strict';

/* istanbul ignore next */
function preventGhosts(element) {
  if (!element) { return; }

  if (element instanceof $) {
    element = element[0];
  }

  var
    coordinates = [],
    threshold = 25,
    timeout = 2500
    ;

  if ('ontouchstart' in window) {
    element.addEventListener('touchstart', resetCoordinates, true);
    element.addEventListener('touchend', registerCoordinates, true);
    element.addEventListener('click', preventGhostClick, true);
    element.addEventListener('mouseup', preventGhostClick, true);
  }

  function preventGhostClick(ev) {
    for (var i = 0; i < coordinates.length; i++) {
      var x = coordinates[i][0];
      var y = coordinates[i][1];

      // within the range, so prevent the click
      if (
        Math.abs(ev.clientX - x) < threshold &&
        Math.abs(ev.clientY - y) < threshold
      ) {
        ev.stopPropagation();
        ev.preventDefault();
        break;
      }
    }
  }

  function resetCoordinates() {
    coordinates = [];
  }

  function popCoordinates() {
    coordinates.splice(0, 1);
  }

  function registerCoordinates(ev) {
    // touchend is triggered on every releasing finger
    // changed touches always contain the removed touches on a touchend
    // the touches object might contain these also at some browsers (firefox os)
    // so touches - changedTouches will be 0 or lower, like -1, on the final touchend
    if (ev.touches.length - ev.changedTouches.length <= 0) {
      var touch = ev.changedTouches[0];

      coordinates.push([touch.clientX, touch.clientY]);
      setTimeout(popCoordinates, timeout);
    }
  }
}

_.merge(quasar, {
  prevent: {
    ghost: {
      click: preventGhosts
    }
  }
});
