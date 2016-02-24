'use strict';

function hammerify(el, options) {
  var $el = $(el);

  if (!$el.data('hammer')) {
    $el.data('hammer', new Hammer($el[0], options));
  }
}

$.fn.hammer = function(options) {
  return this.each(function() {
    hammerify(this, options);
  });
};

$.fn.getHammer = function() {
  if (this.length > 1) {
    throw new Error('Works only on one node because Hammer config is individual.');
  }
  return $(this).data('hammer');
};

Hammer.Manager.prototype.emit = /* istanbul ignore next */(function(originalEmit) {
  return function(type, data) {
    originalEmit.call(this, type, data);
    $(this.element).trigger({
      type: type,
      gesture: data
    });
  };
})(Hammer.Manager.prototype.emit);
