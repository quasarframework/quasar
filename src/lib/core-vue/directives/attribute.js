'use strict';

Vue.directive('attr', function(attribs, oldAttribs) {
  if (typeof attribs === 'undefined') {
    console.error('v-attr received empty new value from "' + oldAttribs + '"', this.el);
    return;
  }

  var
    self = this,
    values = Array.isArray(attribs) ? attribs : [attribs]
    ;

  if (typeof oldAttribs !== 'undefined') {
    var oldValues = Array.isArray(oldAttribs) ? oldAttribs : [oldAttribs];

    oldValues = oldValues.filter(function(val) {
      return !values.includes(val);
    });

    oldValues.forEach(function(val) {
      console.log(val, this.el.hasAttribute(val), this.el.hasAttribute('bogus'));
      this.el.removeAttribute(val);
    }.bind(this));
  }

  values.forEach(function(value) {
    this.el.setAttribute(value, '');
  }.bind(this));
});
