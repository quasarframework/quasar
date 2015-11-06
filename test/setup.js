'use strict';

window.expect = chai.expect;
window.testing = {
  phantomjs: (function() {
    return navigator.userAgent.indexOf('PhantomJS') > -1;
  }())
};

// Immediately throw error when using Sinon.
// The default behavior is to throw error in a setTimeout().
window.sinon.logError.useImmediateExceptions = true;

if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = function bind(obj) {
    var
      args = Array.prototype.slice.call(arguments, 1),
      self = this,
      Nop = function() {},
      bound = function() {
        return self.apply(
          this instanceof Nop ? this : obj || {}, args.concat(
            Array.prototype.slice.call(arguments)
          )
        );
      };

    Nop.prototype = this.prototype || {};
    bound.prototype = new Nop();
    return bound;
  };
}
