/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

var chai = require('chai');

global.expect = chai.expect;
global.moquire = require('moquire');
global.sinon = require('sinon');

chai.use(require('sinon-chai'));
