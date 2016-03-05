'use strict';

var container = $('head');

function injectCSS(url) {
  if (!url) {
    throw new Error('Specify CSS URL when injecting.');
  }

  if (container.find('[href="' + url + '"]').length > 0) {
    // we don't inject duplicates
    return;
  }

  $('<link>', {
    type: 'text/css',
    href: url,
    rel: 'stylesheet',
    'data-injected-css': true
  }).appendTo(container);
}

function clear() {
  container.find('[data-injected-css]').remove();
}

module.exports = {
  inject: injectCSS,
  clear: clear
};
