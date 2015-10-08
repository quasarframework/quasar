/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

if (typeof process !== 'undefined') {
  /**
   * We are in Node. Require modules.
   */
  expect = require('chai').expect;
  sinon = require('sinon');
  inBrowser = false;
}
else {
  /**
   * We are in a browser.
   * Set up variables like above using serves js files.
   */
  expect = chai.expect;
  inBrowser = true;
}
