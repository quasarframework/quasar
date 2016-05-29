'use strict';

function isActive() {
  return document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
};

function requestFullscreen(target) {
  target = target || document.documentElement;

  if (isActive()) {
    return;
  }

  if (target.requestFullscreen) {
    target.requestFullscreen();
  }
  else if (target.msRequestFullscreen) {
    target.msRequestFullscreen();
  }
  else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen();
  }
  else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  }
};

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

function toggleFullscreen(target) {
  if (isActive()) {
    exitFullscreen();
  }
  else {
    requestFullscreen(target);
  }
};


$.extend(true, quasar, {
  is: {
    fullscreen: isActive
  },
  request: {
    fullscreen: requestFullscreen
  },
  exit: {
    fullscreen: exitFullscreen
  },
  toggle: {
    fullscreen: toggleFullscreen
  }
});
