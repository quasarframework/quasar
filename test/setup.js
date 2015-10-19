/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

if (typeof process !== 'undefined') {
  /**
   * We are in Node. Require modules.
   */
  var chai = require('chai');
  var sinonChai = require('sinon-chai');

  expect = require('chai').expect;
  sinon = require('sinon');

  chai.use(sinonChai);
}
else {
  /**
   * We are in a browser.
   * Set up variables like above using serves js files.
   */
  window.expect = chai.expect;
  window.testing = {
    phantomjs: (function() {
      return navigator.userAgent.indexOf('PhantomJS') > -1;
    }())
  };
}

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

// Immediately throw error when using Sinon.
// The default behavior is to throw error in a setTimeout().
window.sinon.logError.useImmediateExceptions = true;
