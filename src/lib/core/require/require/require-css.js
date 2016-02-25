'use strict';

function createNode(options) {
  /* istanbul ignore next */
  options = options || {};

  /* istanbul ignore next */
  if (!options.tag) {
    throw new Error('Please specify tag');
  }

  var tag = options.tag;
  var appendTo = options.appendTo;

  delete options.tag;
  delete options.appendTo;

  var node = $('<' + tag + '>', options);

  /* istanbul ignore next */
  if (appendTo) {
    node.appendTo(appendTo);
  }

  return node;
}

function injectCSS(url) {
  if (node.find('[href="' + url + '"]').length > 0) {
    // we don't inject duplicates
    return;
  }

  createNode({
    tag: 'link',
    appendTo: node,
    type: 'text/css',
    href: url,
    rel: 'stylesheet'
  });
}

function clear() {
  node.empty();
}


var node = createNode({
  tag: 'div',
  id: '__quasar_css',
  appendTo: $('body')
});

module.exports = {
  inject: injectCSS,
  clear: clear
};
