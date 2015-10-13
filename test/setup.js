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
  inBrowser = false;
}
else {
  /**
   * We are in a browser.
   * Set up variables like above using serves js files.
   */
  window.expect = chai.expect;
  window.inBrowser = true;
}
