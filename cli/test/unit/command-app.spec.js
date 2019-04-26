'use strict';

var
  app = require('../../lib/cmds/app'),
  fs = require('../../lib/file-system'),
  logger = require('../../lib/logger')
  ;

describe('command: new', function() {
  var folder = process.cwd() + '/test-app/';
  var program = {
    normalize: function() {
      return '';
    },
    option: function() {}
  };

  logger(program);

  before(function() {
    fs.remove(folder);
  });
  beforeEach(function() {
    sinon.spy(console, 'log');
  });
  afterEach(function() {
    console.log.restore();
  });
  after(function() {
    fs.remove(folder);
  });

  it('should be able to generate one', function(done) {
    this.timeout(15000);
    expect(fs.exists(folder)).to.equal(false);
    app.create(program, 'test-app', function(result) {
      expect(result).to.equal(0);
      expect(fs.exists(folder)).to.equal(true);
      expect(fs.exists(folder + 'package.json')).to.equal(true);
      done();
    });
  });

  it('should output error when generating over existing folder', function(done) {
    expect(fs.exists(folder)).to.equal(true);
    app.create(program, 'test-app', function(result) {
      expect(result).to.not.equal(0);
      expect(console.log).to.have.been.calledOnce;
      done();
    });
  });

});
